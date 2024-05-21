import { DataSource } from "typeorm";
import EmailStatus from "../model/email";
import { v4 as uuidv4 } from "uuid";
import Database from "../../pkg/databases/pql/pql";

interface EmailRepository {
  insert(email: EmailStatus): any;
  update(userId: string): any;
  //   delete(id: string): any;
  //   getUsersById(id: string): Promise<Users>;
}

class EmailRepositoryImpl implements EmailRepository {
  private emailRepo: DataSource;

  constructor() {
    const newDb = new Database();
    this.emailRepo = newDb.getDataSource();
  }

  async insert(email: EmailStatus) {
    try {
      await this.emailRepo
        .createQueryBuilder()
        .insert()
        .into(EmailStatus)
        .values(email)
        .execute();
    } catch (err) {
      console.log("err", err);
      throw new Error("Failed to create email status");
    }
  }

  async update(userId: string) {
    try {
      await this.emailRepo
        .createQueryBuilder()
        .update(EmailStatus)
        .set({
          isDelivered: true,
          deliveredAt: new Date(),
          updatedAt: new Date(),
        })
        .where("user_id = :userId", { userId: userId })
        .execute();
    } catch (err) {
      console.log("err", err);
      throw new Error("Failed to update email status");
    }
  }

  //   async delete(id: string) {
  //     try {
  //       await this.usersRepo
  //         .createQueryBuilder()
  //         .delete()
  //         .from(Users)
  //         .where("id = :id", { id: id })
  //         .execute();
  //     } catch (err) {
  //       console.log("err", err);
  //       throw new Error("Failed to delete users");
  //     }
  //   }

  //   async getUsersById(id: string): Promise<Users> {
  //     try {
  //       const usersResp = await this.usersRepo
  //         .getRepository(Users)
  //         .createQueryBuilder("users")
  //         .where("users.id = :id", { id: id })
  //         .getOne();

  //       return usersResp;
  //     } catch (err) {
  //       throw new Error("Failed to retrieve users");
  //     }
  //   }
}

export default new EmailRepositoryImpl();
