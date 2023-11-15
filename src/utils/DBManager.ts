import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  ScanCommandOutput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

export class DBManager<T> {
  private classType: T;
  private readonly tableName: string;
  private readonly client: DynamoDBClient;

  constructor(tableName: string, classType: T) {
    this.tableName = tableName;
    this.classType = classType;
    this.client = new DynamoDBClient({});
  }

  async getAll(): Promise<T[]> {
    const params = {
      TableName: this.tableName,
    };

    const { Items }: ScanCommandOutput = await this.client.send(
      new ScanCommand(params)
    );

    if (Items && Items?.length) {
      return Items.map((item: any) => {
        const instance = this.classType;

        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            instance[key] = item[key];
          }
        }

        return instance;
      });
    }

    return [];
  }

  async addItem(item: Record<string, any>): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: item,
    };

    await this.client.send(new PutItemCommand(params));
  }

  async getItem(key: Record<string, any>): Promise<Record<string, any> | null> {
    const params = {
      TableName: this.tableName,
      Key: key,
    };

    const { Item } = await this.client.send(new GetItemCommand(params));

    return Item ? Item : null;
  }

  async deleteItem(key: Record<string, any>): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: key,
    };

    await this.client.send(new DeleteItemCommand(params));
  }

  async updateItem(
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await this.client.send(new UpdateItemCommand(params));
  }
}
