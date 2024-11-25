import AppDataSource from "../../../utils/data-source";
import Favorite from "../../../entity/Favorite";
import User from "../../../entity/User";

export default async function handler(req, res) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const favoriteRepository = AppDataSource.getRepository(Favorite);

      // Găsește utilizatorul folosind email-ul
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Obține toate orașele favorite ale utilizatorului
      const favorites = await favoriteRepository.find({
        where: { user: { id: user.id } },
      });

      return res.status(200).json({ favorites });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching favorites." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
