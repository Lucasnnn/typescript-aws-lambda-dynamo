import { mocks } from "./clientsMock";
import { ClientService } from "../../src/services/ClientService";
import { ClientFunctions } from "../../src/functions/ClientFunctions";
import { Client } from "../../src/models/client";

const clientFunctions = new ClientFunctions(new ClientService());

describe("ClientFunctions", () => {
  let insertedClient: Client[] = [];

  test("create clients", async () => {
    const createPromises = mocks?.map(async (client) => {
      const event = { body: JSON.stringify(client) };
      const result = await clientFunctions.create(event);

      expect(result.statusCode).toBe(200);

      insertedClient.push(JSON.parse(result.body).data);

      expect(JSON.parse(result.body).message).toBe(
        "Successfully created client."
      );

      expect(JSON.parse(result.body).data).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          ...JSON.parse(result.body).data,
        })
      );

      return result;
    });

    const result = await Promise.all(createPromises);
  });

  test("find all clients", async () => {
    const result = await clientFunctions.findAll();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe(
      "Successfully retrieved all clients !"
    );

    const responseData = JSON.parse(result.body).data;
    expect(Array.isArray(responseData)).toBe(true);

    responseData.forEach((item) => {
      expect(insertedClient).toContainEqual(item);
    });
  });

  test("find client by id", async () => {
    const client = insertedClient[1];
    const validClientId = client.id;

    const event = { pathParameters: { id: validClientId } };

    const result = await clientFunctions.findById(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe(
      "Successfully retrieved client."
    );

    expect(JSON.parse(result.body).data).toEqual(client);
  });

  test("update client", async () => {
    const client = insertedClient[1];
    const idToUpdate = client?.id;

    const eventFind = { pathParameters: { id: idToUpdate } };

    if (idToUpdate) {
      const resultBeforeUpdate = await clientFunctions.findById(eventFind);

      const updatedData = JSON.parse(JSON.stringify(resultBeforeUpdate));
      updatedData.fullName = client?.fullName + " Updated Name";

      const event = {
        ...eventFind,
        body: JSON.stringify(updatedData),
      };

      const updateResult = await clientFunctions.update(event);

      expect(JSON.parse(resultBeforeUpdate.body).data).toEqual(
        insertedClient[1]
      );

      expect(updateResult).toBeTruthy();
    }
  });

  test("delete client", async () => {
    const client = insertedClient[0];

    const event = { pathParameters: { id: client.id } };

    const result = await clientFunctions.deleteById(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe(
      "Successfully deleted client."
    );

    const checkDelete = await clientFunctions.findById(event);

    expect(checkDelete.statusCode).toBe(404);
  });
});
