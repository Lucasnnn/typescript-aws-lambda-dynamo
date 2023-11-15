import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  ScanCommandOutput,
  ScanCommand,
  DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class DBManager {
  private readonly tableName: string;
  private readonly client: DynamoDBClient;

  constructor(tableName: string, tester?: DynamoDBClientConfig) {
    this.tableName = tableName;
    this.client = new DynamoDBClient({});

    if (tester) {
      this.client = new DynamoDBClient(tester);
    }
  }

  async getAll(): Promise<
    {
      [key: string]: any;
    }[]
  > {
    const params = {
      TableName: this.tableName,
    };

    const { Items }: ScanCommandOutput = await this.client.send(
      new ScanCommand(params)
    );

    if (Items && Items?.length) {
      const result = Items?.map((item) => {
        return unmarshall(item);
      })?.filter((fil) => fil);

      return result;
    } else {
      return [];
    }
  }

  async insertAll(items: Record<string, any>[]) {
    const insertPromises: Promise<any>[] = [];

    for (let item of items) {
      const insertPromise = this.insert(item);
      insertPromises.push(insertPromise);
    }

    await Promise.all(insertPromises);

    return this.getAll();
  }

  async insert(item: Record<string, any>): Promise<Record<string, any>> {
    const newItem = {
      ...item,
      id: uuidv4(),
    };

    const params = {
      Item: marshall(newItem),
      TableName: this.tableName,
    };

    await this.client.send(new PutItemCommand(params));

    return newItem;
  }

  async getById(id: string): Promise<any | null> {
    const params = {
      Key: marshall({ id }),
      TableName: this.tableName,
    };

    const { Item } = await this.client.send(new GetItemCommand(params));

    return Item ? unmarshall(Item) : null;
  }

  async deleteItem(id: string): Promise<void> {
    const params = {
      Key: marshall({ id }),
      TableName: this.tableName,
    };

    await this.client.send(new DeleteItemCommand(params));
  }

  async update(id: string, body: any) {
    const objKeys = Object.keys(body);

    const params = {
      Key: marshall({ id }),
      TableName: this.tableName,
      UpdateExpression: `SET ${objKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
          }),
          {}
        )
      ),
    };

    await this.client.send(new UpdateItemCommand(params));
    body.id = id;

    return body;
  }
}
