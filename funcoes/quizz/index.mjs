import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "sa-east-1" });
const S3_BUCKET_NAME = "spikai";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const formatarNomeArquivo = (email) => {
  if (!email) {
    throw new Error("Email não fornecido.");
  }

  const nomeFormatado = email
    .toLowerCase()
    .replace(/@/g, "_at_")
    .replace(/\./g, "_dot_")
    .replace(/[^a-z0-9_]/g, ""); // Remove qualquer outro caractere não-alfanumérico

  return `resource/user_${nomeFormatado}.json`;
};

export const handler = async (event) => {
  try {
    // 1. Analisa o corpo da requisição para obter os dados do usuário
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
    const { email, idCurso, respostas, nomeAtividade } = body;

    // 2. Formata o email para obter a chave do arquivo no S3
    const s3Key = formatarNomeArquivo(email);

    let dadosExistentes = [];

    // 3. Tenta buscar o arquivo existente no S3
    try {
      const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
      });
      const response = await s3Client.send(getCommand);

      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        });

      const fileContent = await streamToString(response.Body);
      dadosExistentes = JSON.parse(fileContent);
    } catch (e) {
      if (e.name === "NoSuchKey") {
        // O arquivo não existe, então vamos criar um novo
        console.log(`Arquivo não encontrado: ${s3Key}. Criando novo...`);
      } else {
        // Outro erro no S3, joga o erro para cima
        throw e;
      }
    }

    const curso = dadosExistentes.cursos.find((curso) => curso.id === idCurso);

    if (nomeAtividade == "Quizz") {
      const atividade = curso?.atividades.find((atv) => atv.nome === "Quizz");
      atividade.perguntas = respostas;
      atividade.concluida = true;
      atividade.dataConclusao = new Date().toISOString();
      curso.concluido = 75;
    } else if (nomeAtividade == "Texto") {
      const atividade = curso?.atividades.find((atv) => atv.nome === "Texto");

      if (!atividade)
        curso?.atividades.push({
          nome: "Texto",
          perguntas: respostas,
          concluida: body.ehConcluida,
          concluida: body.ehConcluida ? new Date().toISOString() : "",
        });
      else {
        atividade.perguntas = respostas;
        atividade.concluida = body.ehConcluida;
        if (body.ehConcluida) atividade.dataConclusao = new Date().toISOString();
        atividade.texto = body.texto;
      }
    } else {
      const atividade = curso?.atividades.find((atv) => atv.nome === "Conteúdo");
      atividade.concluida = true;
      atividade.dataConclusao = new Date().toISOString();
      curso.concluido = 50;
    }

    // 4. Adiciona as novas respostas aos dados existentes
    const dadosParaSalvar = {
      ...dadosExistentes,
      ultimaAtualizacao: new Date().toISOString(),
    };

    // 5. Salva o objeto atualizado de volta no S3
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: JSON.stringify(dadosParaSalvar),
      ContentType: "application/json",
    });

    await s3Client.send(putCommand);

    // 6. Retorna uma resposta de sucesso
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Respostas salvas com sucesso!", file: s3Key }),
    };
  } catch (error) {
    console.error("Erro:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Erro ao processar a requisição.", error: error.message }),
    };
  }
};
