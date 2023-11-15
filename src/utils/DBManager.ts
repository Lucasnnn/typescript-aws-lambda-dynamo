import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  ScanCommandOutput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class DBManager {
  private readonly tableName: string;
  private readonly client: DynamoDBClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = new DynamoDBClient({});
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
    }

    return [];
  }

  async addItem(item: Record<string, any>): Promise<Record<string, any>> {
    const newItem = {
      ...item,
      id: uuidv4(),
    };

    const params = {
      Item: marshall(newItem),
      TableName: this.tableName,
    };

    await this.client.send(new PutItemCommand(params));

    return params.Item;
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
}
