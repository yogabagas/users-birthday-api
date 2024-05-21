import { Request, Response } from "express";
import { CreateUsersRequest, UpdateUsersRequest } from "../domain/dto/users";
import UserService from "../service/users.service";

export default class UsersController {
  private usersService: UserService;

  constructor() {
    this.usersService = new UserService();
    this.create = this.create.bind(this); // Bind the method to the class instance
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async create(req: Request, res: Response) {
    const { firstName, lastName, birthdate, email, location } = req.body;
    if (!firstName || !lastName || !birthdate || !location || !email) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    try {
      const createUsersReq = new CreateUsersRequest({
        id: "", // or generate a default id if needed
        firstName,
        lastName,
        birthdate: new Date(birthdate),
        email,
        location,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("createReq", createUsersReq);

      const validationError = createUsersReq.validate();

      if (validationError) {
        res.status(400).send(validationError.message);
      }

      const createUsersResp = await this.usersService.createNewUsers(
        createUsersReq
      );

      res.status(201).send(createUsersResp);
    } catch (error) {
      res.status(500).send({
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    console.log("id", id);

    try {
      const deleteUsersResp = await this.usersService.deleteUsersById(id);

      res.status(204).send(deleteUsersResp);
    } catch (error) {
      res.status(500).send({
        error: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    const { firstName, lastName, birthdate, email, location } = req.body;

    try {
      const updateUsersReq = new UpdateUsersRequest({
        firstName,
        lastName,
        birthdate: new Date(birthdate),
        email,
        location,
      });

      await this.usersService.updateUsers(updateUsersReq);

      res.status(200).send("OK");
    } catch (err) {
      res.status(500).send({
        error: err.message,
      });
    }
  }
}
