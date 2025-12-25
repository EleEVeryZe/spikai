import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "sa-east-1" });
const BUCKET_NAME = "spikai";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};


export const handler = async (event) => {
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

};
