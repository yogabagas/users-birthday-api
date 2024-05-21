import { DataSource } from "typeorm";
import Users from "../model/users";
import Database from "../../pkg/databases/pql/pql";

interface UsersRepository {
  insert(users: Users): Promise<Users>;
  delete(id: string): any;
  getUsersById(id: string): Promise<Users>;
  getUsersEmailPending(): Promise<Users>;
  updateUsers(users: Users): any;
}

class UsersRepositoryImpl implements UsersRepository {
  private usersRepo: DataSource;

  constructor() {
    const newDb = new Database();
    this.usersRepo = newDb.getDataSource();
  }

  async insert(users: Users): Promise<Users> {
    try {
      const result = await this.usersRepo
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values([
          {
            firstName: users.firstName,
            lastName: users.lastName,
            birthdate: users.birthdate,
            email: users.email,
            location: users.location,
          },
        ])
        .returning("id")
        .execute();

      const usersResp: Users = {
        id: result.generatedMaps[0].id,
        ...users,
      };

      return usersResp;
    } catch (err) {
      console.log("err", err);
      throw new Error("Failed to create users");
    }
  }

  async delete(id: string) {
    try {
      await this.usersRepo
        .createQueryBuilder()
        .delete()
        .from(Users)
        .where("id = :id", { id: id })
        .execute();
    } catch (err) {
      console.log("err", err);
      throw new Error("Failed to delete users");
    }
  }

  async getUsersById(id: string): Promise<Users> {
    try {
      const usersResp = await this.usersRepo
        .getRepository(Users)
        .createQueryBuilder("users")
        .where("users.id = :id", { id: id })
        .getOne();

      return usersResp;
    } catch (err) {
      throw new Error("Failed to retrieve users");
    }
  }

  async getUsersEmailPending(): Promise<Users> {
    try {
      return await this.usersRepo
        .getRepository(Users)
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.emailStatuses", "email")
        .where("email.is_delivered = :isDelivered", { isDelivered: false })
        .getOne();
    } catch (err) {
      console.log("error", err);
      throw new Error("Failed to retrieve user email");
    }
  }

  async updateUsers(users: Users) {
    try {
      const updateData: Partial<Users> = {};

      if (users.firstName !== null && users.firstName !== undefined) {
        updateData.firstName = users.firstName;
      }
      if (users.lastName !== null && users.lastName !== undefined) {
        updateData.lastName = users.lastName;
      }
      if (users.birthdate !== null && users.birthdate !== undefined) {
        updateData.birthdate = users.birthdate;
      }
      if (users.email !== null && users.email !== undefined) {
        updateData.email = users.email;
      }
      if (users.location !== null && users.location !== undefined) {
        updateData.location = users.location;
      }

      updateData.updatedAt = new Date();

      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields to update");
      }

      await this.usersRepo
        .createQueryBuilder()
        .update(Users)
        .set(updateData)
        .where("id = :id", { id: users.id })
        .execute();
    } catch (err) {
      throw new Error("Failed to update user");
    }
  }
}

export default new UsersRepositoryImpl();
