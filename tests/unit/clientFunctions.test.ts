import { mocks } from "./clientsMock";
import { APIGatewayProxyResult } from "aws-lambda";
import { ClientService } from "../../src/services/ClientService";
import { create, findAll } from "../../src/functions/ClientFunctions";

jest.mock("../../src/services/ClientService");

describe("ClientFunctions", () => {
  let createClient = create;
  // let findAllClients = findAll;

  beforeEach(() => {
    const mockClientService = new ClientService() as jest.Mocked<ClientService>;
    mockClientService.findAll.mockResolvedValue(mocks);
  });

  test("create function - success", async () => {
    const mockEvent = {
      body: JSON.stringify(mocks[0]),
    };

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully created client.",
      }),
    };

    const actualResult = await createClient(mockEvent);

    expect(actualResult).toEqual(expectedResult);
  });

  // test("findAll function - success", async () => {
  //   const expectedResult: APIGatewayProxyResult = {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       message: "Successfully retrieved all clients !",
  //       data: mocks,
  //     }),
  //   };

  //   const actualResult = await findAllClients();

  //   expect(actualResult).toEqual(expectedResult);
  // });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
