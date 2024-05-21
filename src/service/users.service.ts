import {
  CreateUsersReq,
  CreateUsersRequest,
  CreateUsersResp,
  UpdateUsersReq,
} from "../domain/dto/users";
import Users from "../domain/model/users";
import UsersRepository from "../domain/repository/users.repo";
import EmailRepository from "../domain/repository/email.repo";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import cron, { ScheduledTask } from "node-cron";
import EmailStatus from "../domain/model/email";

class UsersService {
  private scheduleTask: ScheduledTask;

  constructor() {
    // Schedule the sendEmail method to run at 9 AM every day
    this.scheduleTask = cron.schedule(
      "0 9 * * *",
      async () => {
        console.log(
          "Running scheduled task: send email every at 9 AM local time"
        );
        try {
          const users = await this.sendEmail();

          if (users !== null) {
            await this.updateEmailStatus(users.id);
          }
        } catch (err) {
          console.error(
            `Error while sending email: ${err.message}, scheduler will be stopped`
          );
          this.scheduleTask.stop();
        }
      },
      {
        timezone: "Asia/Jakarta", // Adjust this timezone as needed
      }
    );

    console.log("Email scheduler initialized.");
  }

  public async createNewUsers(
    req: CreateUsersRequest
  ): Promise<CreateUsersResp> {
    try {
      console.log("Request received:", req);

      const userMdl: Users = {
        firstName: req.firstName,
        lastName: req.lastName,
        birthdate: req.birthdate,
        email: req.email,
        location: req.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Parsed user model:", userMdl);

      const usersResp = await UsersRepository.insert(userMdl);

      const emailMdl: EmailStatus = {
        name: userMdl.firstName + " " + userMdl.lastName,
        isDelivered: false,
        user: usersResp,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await EmailRepository.insert(emailMdl);

      return { message: `user has been created` };
    } catch (err) {
      throw new Error(`failed to create user: ${err.message}`);
    }
  }

  public async deleteUsersById(id: string): Promise<Error> | null {
    try {
      console.log("Request received: ", id);

      await UsersRepository.delete(id);

      return null;
    } catch (err) {
      throw new Error(`failed to create user: ${err.message}`);
    }
  }

  public async updateUsers(req: UpdateUsersReq) {
    try {
      const userMdl: Users = {
        firstName: req.firstName,
        lastName: req.lastName,
        birthdate: req.birthdate,
        email: req.email,
        location: req.location,
      };

      await UsersRepository.updateUsers(user);
    } catch (err) {
      throw new Error(`failed to create user: ${err.message}`);
    }
  }

  private async sendEmail(): Promise<Users> | null {
    try {
      const users = await UsersRepository.getUsersEmailPending();

      if (users === null) {
        return null;
      }

      const fullName = users.firstName + " " + users.lastName;

      const response = await axios.post(
        "https://email-service.digitalenvision.com.au/send-email",
        {
          email: users.email,
          message: `Hey, ${fullName} it's your birthday`,
        }
      );

      console.log("response status from client", response.status);

      if (response.status === 200) {
        return users;
      }
      return null;
    } catch (err) {
      console.error(`Failed to send email: ${err}`);
      throw err;
    }
  }

  private async updateEmailStatus(userId: string) {
    try {
      await EmailRepository.update(userId);
    } catch (err) {
      console.log("error update email status", err);
      throw new Error("error update email status");
    }
  }
}

export default UsersService;
