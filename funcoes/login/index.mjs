import {
    GetObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

const s3 = new S3Client({ region: 'sa-east-1' });

const JWT_SECRET = "SECRET_TO_BE_MODEFIEDTODO";

const BUCKET_NAME = 'spikai';

const streamToString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });
};

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight OK' })
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Corpo da requisição vazio.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Body inválido.' })
    };
  }

  const { email, password } = body;

  if (!email || !password) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Email e senha são obrigatórios.' })
    };
  }

  // Monta o nome do arquivo com base no e-mail
  const sanitizedEmail = email.replace(/@/g, '_at_').replace(/\./g, '_dot_');
  const filename = `resource/user_${sanitizedEmail}.json`;

  try {
    const getObjectCmd = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    const response = await s3.send(getObjectCmd);
    const userFileContent = await streamToString(response.Body);
    const userData = JSON.parse(userFileContent);

    if (userData.password !== password) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Senha incorreta.' })
      };
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        email: userData.email,
        name: userData.name || 'Usuário'
      },
      JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Login bem-sucedido',
        token
      })
    };
  } catch (err) {
    console.error('Erro ao buscar usuário no S3:', err);

    if (err.name === 'NoSuchKey') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Usuário não encontrado.' })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Erro interno.', error: err.message })
    };
  }
};
