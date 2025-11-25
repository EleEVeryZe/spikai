import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cursos } from "./template.curso.mjs";

const s3 = new S3Client({ region: "sa-east-1" });
const BUCKET_NAME = "spikai";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const streamToString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
};

export const handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Preflight OK" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Corpo da requisição vazio." }),
      };
    }

    const userData = JSON.parse(event.body);
    const userEmail = userData.email;

    if (!userEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "E-mail não fornecido." }),
      };
    }

    const sanitizedEmail = userEmail.toLowerCase().replace(/@/g, "_at_").replace(/\./g, "_dot_");
    const filename = `resource/user_${sanitizedEmail}.json`;

    // Verifica se o arquivo existe
    let userExists = false;
    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: filename }));
      userExists = true;
    } catch (error) {
      if (error.name !== "NotFound" && error.$metadata?.httpStatusCode !== 404) {
        throw error;
      }
    }

    // Busca lista de usuários atual
    const getUsersCmd = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "resource/usuarios.json",
    });
    const usersResponse = await s3.send(getUsersCmd);
    const userFileContent = await streamToString(usersResponse.Body);
    const userList = JSON.parse(userFileContent);

    // Se é modo de edição
    if (userData.isEdit) {
      if (!userExists) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Usuário não encontrado para edição." }),
        };
      }

      // Atualiza o arquivo individual
      const getExistingCmd = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
      });
      const existingResponse = await s3.send(getExistingCmd);
      const existingUserContent = await streamToString(existingResponse.Body);
      const existingUser = JSON.parse(existingUserContent);

      const updatedUser = {
        ...existingUser,
        ...userData,
        password: "", // não sobrescreve senha
      };

      // Atualiza no usuários.json
      const index = userList.findIndex((u) => u.email === userEmail);
      if (index !== -1) {
        userData.password = userList[index].password;
        userList[index] = { ...userList[index], ...userData };
      }

      // Salva alterações
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: "resource/usuarios.json",
          Body: JSON.stringify(userList, null, 2),
          ContentType: "application/json",
        })
      );

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: JSON.stringify(updatedUser, null, 2),
          ContentType: "application/json",
        })
      );

      console.log(`Usuário ${userEmail} atualizado com sucesso.`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Usuário atualizado com sucesso.",
          key: filename,
        }),
      };
    }

    if (userExists) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ message: `O usuário com o e-mail '${userEmail}' já está cadastrado.` }),
      };
    }

    userList.push({ ...userData });

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: "resource/usuarios.json",
        Body: JSON.stringify(userList, null, 2),
        ContentType: "application/json",
      })
    );

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: JSON.stringify({ ...userData, password: "", ehGrupoControle: false, cursos }, null, 2),
        ContentType: "application/json",
      })
    );

    console.log(`Novo cadastro salvo com sucesso em: s3://${BUCKET_NAME}/${filename}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Dados de cadastro salvos com sucesso.",
        key: filename,
      }),
    };
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Erro interno ao salvar os dados.",
        error: error.message,
      }),
    };
  }
};
