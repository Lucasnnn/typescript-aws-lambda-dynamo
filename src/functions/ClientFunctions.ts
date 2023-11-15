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
        Items,
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
}

export const funcs = new ClientFunctions(new ClientService());
export const findAll = funcs.findAll;
