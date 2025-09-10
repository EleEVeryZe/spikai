const AWS = require('aws-sdk');

// Cria uma nova instância do cliente S3
const s3 = new AWS.S3();

// Define o nome do bucket a partir de uma variável de ambiente
const BUCKET_NAME = process.env.BUCKET_NAME;

/**
 * Função principal da Lambda para salvar dados de cadastro após validação.
 * @param {object} event O objeto de evento contendo os dados da requisição.
 * @param {string} event.body O corpo da requisição, que deve conter os dados de cadastro em JSON.
 */
exports.handler = async (event) => {
    try {
        console.log('Evento recebido:', JSON.stringify(event, null, 2));

        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Corpo da requisição vazio.' }),
            };
        }

        const userData = JSON.parse(event.body);
        const userEmail = userData.email;

        if (!userEmail) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'E-mail não fornecido.' }),
            };
        }

        // 1. Cria um nome de arquivo único com base apenas no e-mail
        const sanitizedEmail = userEmail.replace(/@/g, '_at_').replace(/\./g, '_dot_');
        const filename = `cadastros/user_${sanitizedEmail}.json`;

        // 2. Verifica se o arquivo já existe no bucket S3
        try {
            await s3.headObject({
                Bucket: BUCKET_NAME,
                Key: filename,
            }).promise();

            // Se a função não lançou um erro, o arquivo já existe
            console.log(`Usuário com e-mail ${userEmail} já existe.`);
            return {
                statusCode: 409, // Código 409 Conflict indica que o recurso já existe
                body: JSON.stringify({ message: `O usuário com o e-mail '${userEmail}' já está cadastrado.` }),
            };
        } catch (headObjectError) {
            // Se o erro for 'NotFound', o arquivo não existe e podemos continuar
            if (headObjectError.code !== 'NotFound') {
                throw headObjectError; // Lança outros erros do S3 para serem tratados pelo catch principal
            }
        }

        // 3. Se o arquivo não existe, salva o novo cadastro
        const params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: JSON.stringify(userData, null, 2),
            ContentType: 'application/json',
        };

        await s3.putObject(params).promise();
        console.log(`Novo cadastro salvo com sucesso em: s3://${BUCKET_NAME}/${filename}`);

        // 4. Retorna uma resposta de sucesso
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Dados de cadastro salvos com sucesso.',
                key: filename,
            }),
        };

    } catch (error) {
        // 5. Tratamento de erros
        console.error('Erro ao processar a requisição:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro interno ao salvar os dados.',
                error: error.message,
            }),
        };
    }
};