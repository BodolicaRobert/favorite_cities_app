import AppDataSource from "../../../utils/data-source";
import Favorite from "../../../entity/Favorite";
import User from "../../../entity/User";

export default async function handler(req, res) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log(req.body);
  if (req.method === "POST") {
    const { city, userEmail } = req.body;

    if (!city || !userEmail) {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const favoriteRepository = AppDataSource.getRepository(Favorite);

      // Găsește utilizatorul folosind email-ul
      const user = await userRepository.findOne({ where: { email: userEmail } });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Verifică dacă orașul este deja favorit
      const existingFavorite = await favoriteRepository.findOne({
        where: {
          user: { id: user.id },
          cityName: city.name,
        },
      });

      if (existingFavorite) {
        return res.status(200).json({
          isAlreadyFavorite: true,
          message: `The city ${city.name} is already in your favorites.`,
        });
      } else {
        // Adaugă orașul în favorite
        const favorite = favoriteRepository.create({
          cityName: city.name,
          country: city.country,
          latitude: city.latitude,
          longitude: city.longitude,
          user: user,
        });

        await favoriteRepository.save(favorite);
        return res.status(200).json({
          isAlreadyFavorite: false,
          message: `The city "${city.name}" has been added to your favorites.`,
        });
      }
    } catch (error) {
      console.error("Error managing favorites:", error);
      return res.status(500).json({ message: "An error occurred while managing favorites." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
