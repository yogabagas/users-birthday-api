import { Application } from "express";
import UsersRoutes from "./users.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/v1", UsersRoutes);
  }
}
