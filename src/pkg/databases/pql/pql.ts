import EmailStatus from "../../../domain/model/email";
import Users from "../../../domain/model/users";
import { DataSource } from "typeorm";

class Database {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      database: "birthdaydb",
      entities: [Users, EmailStatus],
      synchronize: true,
      logging: true,
    });

    this.initialize();
  }

  private async initialize() {
    try {
      await this.dataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during Data Source initialization", err);
    }
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }
}

export default Database;
