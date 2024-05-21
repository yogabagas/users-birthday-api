import { Router } from "express";
import UsersController from "../controllers/users.controllers";

class TutorialRoutes {
  router = Router();
  usersController = new UsersController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/users", this.usersController.create);
    this.router.delete("/users/:id", this.usersController.delete);
    this.router.put("/users", this.usersController.update);
  }
}

export default new TutorialRoutes().router;
