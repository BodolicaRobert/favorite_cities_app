import User from "../../../entity/User";
import AppDataSource from "../../../utils/data-source";

export default async function handler(req, res) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const userRepo = AppDataSource.getRepository(User);

  if (req.method === "GET") {
    const { name = "Ion", age = 8 } = req.body;
    const user = { name, age };
    await userRepo.save(user);
    res.status(200).json({ message: "User created", user });
  } else {
    const users = await userRepo.find();
    res.status(200).json(users);
  }
}
