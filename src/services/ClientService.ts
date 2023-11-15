import { Client } from "../models/client";
import { DBManager } from "../utils/DBManager";

export class ClientService {
  private readonly DB: DBManager;

  constructor() {
    this.DB = new DBManager(process.env.DYNAMODB_CLIENT_TABLE!);
  }

  findAll(): Promise<Client[]> {
    return this.DB.getAll();
  }

  findById(id: string): Promise<Client> {
    return this.DB.getById(id);
  }

  create(body: Client): Promise<Client> {
    return this.DB.insert(body);
  }

  update(id: string, body: Client): Promise<Client> {
    return this.DB.update(id, body);
  }

  delete(id: string): Promise<void> {
    return this.DB.deleteItem(id);
  }
}
