import AppDataSource from "../../../utils/data-source";
import Favorite from "../../../entity/Favorite";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { cityId } = req.body;

    if (!cityId) {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    try {
      const favoriteRepository = AppDataSource.getRepository(Favorite);

      // Găsește orașul favorit pe baza cityId și email-ului
      const favorite = await favoriteRepository.findOne({
        where: {
          id: cityId // Folosim cityId direct     
        },
      });

      if (!favorite) {
        return res.status(404).json({ message: "Favorite city not found for this user." });
      }

      // Șterge favoritul
      await favoriteRepository.remove(favorite);
      return res.status(200).json({ message: "City removed from favorites." });
    } catch (error) {
      console.error("Error removing favorite:", error);
      return res.status(500).json({ message: "An error occurred while removing favorite." });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
