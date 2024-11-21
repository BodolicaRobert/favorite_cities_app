import { EntitySchema } from "typeorm";
import User from "./User";

const Favorite = new EntitySchema({
  name: "Favorite",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    cityName: {
      type: "varchar",
    },
    latitude: {
      type: "float",
    },
    longitude: {
      type: "float",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true, // Creează un foreign key pentru User
      onDelete: "CASCADE", // Șterge preferințele dacă userul este șters
    },
  },
});

export default Favorite;
