import { Client } from "../models/client";
import { APIGatewayProxyResult } from "aws-lambda";
import { ClientService } from "../services/ClientService";

class ClientFunctions {
  constructor(private readonly _service: ClientService) {}

  findAll = async (): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = { statusCode: 200, body: "" };

    try {
      const Items: Client[] = await this._service.findAll();

      response.body = JSON.stringify({
        message: "Successfully retrieved all clients !",
        data: Items,
      });
    } catch (e) {
      console.error(e);

      response.statusCode = 500;

      response.body = JSON.stringify({
        message: "Failed to retrieve clients.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  create = async (event): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = { statusCode: 200, body: "" };

    try {
      const body = JSON.parse(event.body);

      const createResult = await this._service.create(body || {});

      response.body = JSON.stringify({
        message: "Successfully created client.",
        data: createResult,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to create client.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };
}

const funcs = new ClientFunctions(new ClientService());

export const create = funcs.create;
export const findAll = funcs.findAll;
