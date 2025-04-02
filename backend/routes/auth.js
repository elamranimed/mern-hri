const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// Inscription
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { fullName, phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: "Telephone et mot de passe requis" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName, 
      phone,
      password: hashedPassword,
      
    });
    await user.save();
    console.log("Utilisateur créé avec succès:", user);
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error("Erreur lors de l’inscription:", err);
    res
      .status(400)
      .json({ message: "Telephone déjà utilisé ou erreur lors de l’inscription" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: "Telephone et mot de passe requis" });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user._id }, "votre_secret_jwt", {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: {
        fullName: user.fullName,
        phone: user.phone,
        
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les infos de l'utilisateur connecté
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({
      fullName: user.fullName,
      phone: user.phone,
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});







module.exports = router;