const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE = process.env.TABLE_NAME;
const PK = 'balance';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === 'GET') {
    const result = await ddb.send(new GetCommand({ TableName: TABLE, Key: { pk: PK } }));
    const amount = result.Item ? Number(result.Item.amount) : 0;
    return { statusCode: 200, headers, body: JSON.stringify({ amount }) };
  }

  if (method === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { action, amount } = body;
    if (!action || typeof amount !== 'number' || amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Body must include action ("add"|"subtract") and a positive amount' }),
      };
    }

    if (action === 'add') {
      const result = await ddb.send(new UpdateCommand({
        TableName: TABLE,
        Key: { pk: PK },
        UpdateExpression: 'SET amount = if_not_exists(amount, :zero) + :val',
        ExpressionAttributeValues: { ':val': amount, ':zero': 0 },
        ReturnValues: 'UPDATED_NEW',
      }));
      return { statusCode: 200, headers, body: JSON.stringify({ amount: Number(result.Attributes.amount) }) };
    }

    if (action === 'subtract') {
      try {
        const result = await ddb.send(new UpdateCommand({
          TableName: TABLE,
          Key: { pk: PK },
          UpdateExpression: 'SET amount = amount - :val',
          ConditionExpression: 'amount >= :val',
          ExpressionAttributeValues: { ':val': amount },
          ReturnValues: 'UPDATED_NEW',
        }));
        return { statusCode: 200, headers, body: JSON.stringify({ amount: Number(result.Attributes.amount) }) };
      } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
          return { statusCode: 409, headers, body: JSON.stringify({ error: 'Insufficient liamoles' }) };
        }
        throw err;
      }
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'action must be "add" or "subtract"' }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
