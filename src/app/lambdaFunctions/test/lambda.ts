import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.log('event 👉', event);

  return {
    body: JSON.stringify([
      { taskId: 1, text: 'buy groceries 🛍️' },
      { taskId: 2, text: 'wash the dishes 🍽️' }
    ]),
    statusCode: 200
  };
}
