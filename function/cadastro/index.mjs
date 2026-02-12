import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cursos } from "./template.curso.mjs";

const s3 = new S3Client({ region: "sa-east-1" });
const BUCKET_NAME = "spikai";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// ============== CONSTANTS ==============
const FILE_PATHS = {
  PROFESSORS_LIST: "resource/profs.json",
  STUDENTS_LIST: "resource/usuarios.json",
  PROFESSOR_PREFIX: "resource/prof_",
  STUDENT_PREFIX: "resource/user_"
};

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

// ============== UTILITY FUNCTIONS ==============
const streamToString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
};

const sanitizeEmail = (email) => {
  return email.toLowerCase().replace(/@/g, "_at_").replace(/\./g, "_dot_");
};

const getFileKey = (email, isProfessor) => {
  const sanitized = sanitizeEmail(email);
  return isProfessor 
    ? `${FILE_PATHS.PROFESSOR_PREFIX}${sanitized}.json`
    : `${FILE_PATHS.STUDENT_PREFIX}${sanitized}.json`;
};

const getListKey = (isProfessor) => {
  return isProfessor ? FILE_PATHS.PROFESSORS_LIST : FILE_PATHS.STUDENTS_LIST;
};

// ============== S3 OPERATIONS ==============
const fileExists = async (key) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return true;
  } catch (error) {
    if (error.name !== "NotFound" && error.$metadata?.httpStatusCode !== 404) {
      throw error;
    }
    return false;
  }
};

const readJsonFile = async (key) => {
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    }));
    const content = await streamToString(response.Body);
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
};

const writeJsonFile = async (key, data) => {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: "application/json",
  }));
};

// ============== USER OPERATIONS ==============
const prepareUserData = (userData, isEdit = false, existingUser = null) => {
  if (isEdit && existingUser) {
    return {
      ...existingUser,
      ...userData,
      password: existingUser.password || "", // Preserve existing password
    };
  }
  
  return {
    ...userData,
    password: "",
    ehGrupoControle: false,
    cursos: userData.ehProfessor ? [] : cursos,
  };
};

const updateUserInList = (userList, userData, userEmail) => {
  const index = userList.findIndex((u) => u.email === userEmail);
  if (index !== -1) {
    // Preserve password when updating
    userList[index] = { 
      ...userList[index], 
      ...userData,
      password: userList[index].password 
    };
  }
  return userList;
};

// ============== REQUEST HANDLERS ==============
const handlePreflight = () => ({
  statusCode: HTTP_STATUS.OK,
  headers,
  body: JSON.stringify({ message: "Preflight OK" }),
});

const handleBadRequest = (message) => ({
  statusCode: HTTP_STATUS.BAD_REQUEST,
  headers,
  body: JSON.stringify({ message }),
});

const handleEdit = async (userData, userEmail, isProfessor) => {
  const userFileKey = getFileKey(userEmail, isProfessor);
  const userExists = await fileExists(userFileKey);
  
  if (!userExists) {
    return {
      statusCode: HTTP_STATUS.NOT_FOUND,
      headers,
      body: JSON.stringify({ message: "Usuário não encontrado para edição." }),
    };
  }

  const listKey = getListKey(isProfessor);
  const existingUserList = await readJsonFile(listKey);
  const existingUserData = await readJsonFile(userFileKey);

  const updatedUser = prepareUserData(userData, true, existingUserData);
  const updatedList = updateUserInList(existingUserList, userData, userEmail);

  await writeJsonFile(listKey, updatedList);
  await writeJsonFile(userFileKey, updatedUser);

  console.log(`Usuário ${userEmail} atualizado com sucesso.`);
  
  return {
    statusCode: HTTP_STATUS.OK,
    headers,
    body: JSON.stringify({
      message: "Usuário atualizado com sucesso.",
      key: userFileKey,
    }),
  };
};

const handleCreate = async (userData, userEmail, isProfessor) => {
  const userFileKey = getFileKey(userEmail, isProfessor);
  const userExists = await fileExists(userFileKey);
  
  if (userExists) {
    return {
      statusCode: HTTP_STATUS.CONFLICT,
      headers,
      body: JSON.stringify({ 
        message: `O usuário com o e-mail '${userEmail}' já está cadastrado.` 
      }),
    };
  }

  const listKey = getListKey(isProfessor);
  const userList = await readJsonFile(listKey);
  
  userList.push({ ...userData });
  await writeJsonFile(listKey, userList);
  
  const newUserData = prepareUserData(userData);
  await writeJsonFile(userFileKey, newUserData);

  console.log(`Novo cadastro salvo com sucesso em: s3://${BUCKET_NAME}/${userFileKey}`);

  return {
    statusCode: HTTP_STATUS.OK,
    headers,
    body: JSON.stringify({
      message: "Dados de cadastro salvos com sucesso.",
      key: userFileKey,
    }),
  };
};

// ============== MAIN HANDLER ==============
export const handler = async (event) => {
  try {
    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return handlePreflight();
    }

    // Validate request body
    if (!event.body) {
      return handleBadRequest("Corpo da requisição vazio.");
    }

    const userData = JSON.parse(event.body);
    const userEmail = userData.email;

    if (!userEmail) {
      return handleBadRequest("E-mail não fornecido.");
    }

    const isProfessor = userData.ehProfessor || false;

    // Route to appropriate handler
    if (userData.isEdit) {
      return await handleEdit(userData, userEmail, isProfessor);
    }
    
    return await handleCreate(userData, userEmail, isProfessor);

  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    
    return {
      statusCode: HTTP_STATUS.INTERNAL_ERROR,
      headers,
      body: JSON.stringify({
        message: "Erro interno ao salvar os dados.",
        error: error.message,
      }),
    };
  }
};