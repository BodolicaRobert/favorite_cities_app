const { default: User } = require("./entity/User");

module.exports = {
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: true,
    logging: true,
    entities: [User], // Asigură-te că acest path este corect
  };
  