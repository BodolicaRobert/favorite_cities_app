import { DataSource } from "typeorm";
import User from "../entity/User";
import Favorite from "../entity/Favorite";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  entities: [User, Favorite],
});

export default AppDataSource;
