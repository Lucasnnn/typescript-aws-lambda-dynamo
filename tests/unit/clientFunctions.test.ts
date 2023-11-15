import { mocks } from "./clientsMock";
import { ClientService } from "../../src/services/ClientService";
import { ClientFunctions } from "../../src/functions/ClientFunctions";

const clientFunctions = new ClientFunctions(new ClientService());

describe("ClientFunctions", () => {
  test("create", async () => {
    const event = { body: JSON.stringify(mocks[1]) };

    const result = await clientFunctions.create(event);

    expect(result.statusCode).toBe(200);

    expect(JSON.parse(result.body).message).toBe(
      "Successfully created client."
    );
  });
});
