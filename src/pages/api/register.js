
import User from "../../../entity/User";
import bcrypt from "bcryptjs";
import AppDataSource from "../../../utils/data-source";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metoda nu este permisă." });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email-ul și parola sunt obligatorii." });
  }

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    // Verifică dacă utilizatorul există deja
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Un utilizator cu acest email există deja." });
    }
    const salt = bcrypt.genSaltSync(10); 
    const hashedPassword = bcrypt.hashSync(password, salt); // Hash
    // Salvează utilizatorul
    const newUser = userRepository.create({ email, password: hashedPassword });
    await userRepository.save(newUser);

    res.status(201).json({ success: true, message: "Utilizator înregistrat cu succes." });
  } catch (error) {
    console.error("Eroare la salvarea utilizatorului:", error);
    res.status(500).json({ success: false, message: "Eroare internă." });
  }
}
