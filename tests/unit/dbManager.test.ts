import { mocks } from "./clientsMock";
import { DBManager } from "../../src/utils/DBManager";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

describe("DBManager", () => {
  let dbManager: DBManager;
  let insertedClients: any[];
  const tableName = "client-table-dev";

  const config: DynamoDBClientConfig = {
    region: "sa-east-1",
    credentials: {
      accessKeyId: "fakeMyKeyId",
      secretAccessKey: "fakeSecretAccessKey",
    },
    endpoint: "http://localhost:8000",
    tls: false,
  };

  beforeAll(async () => {
    dbManager = new DBManager(tableName, config);

    insertedClients = await dbManager.insertAll(mocks);
  });

  afterAll(async () => {
    const allData = await dbManager.getAll();

    const deletePromises = allData.map((item) => dbManager.deleteItem(item.id));

    await Promise.all(deletePromises);
  });

  test("getAll items", async () => {
    const result = await dbManager.getAll();
    expect(result).toEqual(insertedClients);
  });

  test("insert item", async () => {
    const body = mocks[2];

    const result = await dbManager.insert(body);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.anything(),
        ...body,
      })
    );
  });

  test("get item by id", async () => {
    const id = insertedClients[1]?.id;

    if (id) {
      const result = await dbManager.getById(id);

      expect(result).toEqual(insertedClients[1]);
    }
  });

  test("delete item by id", async () => {
    const idToDelete = insertedClients[2]?.id;

    if (idToDelete) {
      const resultBeforeDelete = await dbManager.getById(idToDelete);
      await dbManager.deleteItem(idToDelete);
      const resultAfterDelete = await dbManager.getById(idToDelete);

      expect(resultBeforeDelete).toEqual(insertedClients[2]);

      expect(resultAfterDelete).toBeNull();
    }
  });

  test("update item by id", async () => {
    const idToUpdate = insertedClients[1]?.id;

    if (idToUpdate) {
      const resultBeforeUpdate = await dbManager.getById(idToUpdate);

      const updatedData = {
        ...resultBeforeUpdate,
        updated_at: new Date().toISOString(),
      };
      delete updatedData.id;

      const updateResult = await dbManager.update(idToUpdate, updatedData);

      const resultAfterUpdate = await dbManager.getById(idToUpdate);

      expect(resultBeforeUpdate).toEqual(insertedClients[1]);

      expect(updateResult).toBeTruthy();

      expect(resultAfterUpdate).toEqual(updatedData);
    }
  });
});
