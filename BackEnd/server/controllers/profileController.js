import User from "../models/userModel.js";

export const userProfile = async (req, res) => {
  const { emailAdress } = req.body;

  try {
    const user = await User.findOne({ emailAdress });
    if (!user) {
      res.status(404).json({ message: "Användaren hittades inte" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Fel vid hämtning av användaren:", err);
    res.status(500).json({ error: "fel vid hämtning av användaren" });
  }

  console.log("profile route");
};
