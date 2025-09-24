import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cursos } from "./template.curso";
const s3 = new S3Client({ region: "sa-east-1" });

const BUCKET_NAME = "spikai";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
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
    console.log("Evento recebido:", JSON.stringify(event, null, 2));

    if (!event.body) {
      console.log("Corpo da requisição vazio.");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Corpo da requisição vazio." }),
      };
    }

    const userData = JSON.parse(event.body);
    const userEmail = userData.email;

    if (!userEmail) {
      console.log("E-mail não fornecido.");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "E-mail não fornecido." }),
      };
    }

    const sanitizedEmail = userEmail.replace(/@/g, "_at_").replace(/\./g, "_dot_");
    const filename = `resource/user_${sanitizedEmail}.json`;

    // 1. Verifica se o arquivo já existe
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
      });
      await s3.send(headCommand);

      // Se não lançar erro, o arquivo existe
      console.log(`Usuário com e-mail ${userEmail} já existe.`);
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ message: `O usuário com o e-mail '${userEmail}' já está cadastrado.` }),
      };
    } catch (error) {
      if (error.name !== "NotFound" && error.$metadata?.httpStatusCode !== 404) {
        throw error; // Erro diferente de "Not Found"
      }
      // Continua normalmente se não encontrado
    }

    // 2. Grava novo usuário no S3
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: JSON.stringify({ ...userData, cursos }, null, 2),
      ContentType: "application/json",
    });

    await s3.send(putCommand);

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
