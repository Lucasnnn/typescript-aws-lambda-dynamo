import { Client } from "../models/client";
import { DBManager } from "../utils/DBManager";

export class ClientService {
  private readonly DB: DBManager<Client>;

  constructor() {
    this.DB = new DBManager(process.env.DYNAMODB_CLIENT_TABLE!, new Client());
  }

  async findAll(): Promise<Client[]> {
    return this.DB.getAll();
  }
}
