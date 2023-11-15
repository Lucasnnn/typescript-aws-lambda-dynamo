import { Client } from "../models/client";
import { DBManager } from "../utils/DBManager";

export class ClientService {
  private readonly DB: DBManager<Client>;

  constructor() {
    this.DB = new DBManager(process.env.DYNAMODB_CLIENT_TABLE!, new Client());
  }

  findAll(): Promise<Client[]> {
    return this.DB.getAll();
  }

  create(body: Client): Promise<Client> {
    return this.DB.addItem(body);
  }
}
