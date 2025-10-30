import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "sa-east-1" });

const BUCKET_NAME = "spikai";

const streamToString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
};

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

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

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Body inválido." }),
    };
  }

  const { email } = body;

  if (!email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Email é obrigatórios." }),
    };
  }

  const sanitizedEmail = email.replace(/@/g, "_at_").replace(/\./g, "_dot_");

  try {
    const getObjectCmd = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: sanitizedEmail,
    });

    const response = await s3.send(getObjectCmd);
    const userFileContent = await streamToString(response.Body);

    if (!usuarios) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Usuário mal formatado." }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: userFileContent,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Erro interno.", error: err.message }),
    };
  }
};
