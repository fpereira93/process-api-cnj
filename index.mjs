import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// Cria uma instância do cliente DynamoDB
const dynamoDb = new DynamoDBClient({ region: 'us-east-1' });

export const handler = async (event) => {
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        const cnjNumber = messageBody.cnjNumber;

        const params = {
            TableName: 'MyCNJTable',
            Item: {
                cnjNumber: { S: cnjNumber },
            }
        };
        const command = new PutItemCommand(params);
        await dynamoDb.send(command);

        try {
            await dynamoDb.send(command);
            console.log(`CNJ ${cnjNumber} processado e salvo no DynamoDB.`);
        } catch (error) {
            console.error(`Erro ao salvar CNJ ${cnjNumber}:`, error);
        }
    }
    return { statusCode: 200, body: 'Mensagens processadas com sucesso' };
};