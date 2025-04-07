const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Middleware pour vérifier le token
const User = require("../models/user"); // Modèle utilisateur pour interagir avec la base de données



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
      console.error("Erreur lors de la récupération de l'utilisateur :",err);
      res.status(500).json({ message: "Erreur serveur" });
      
    }
  });

  module.exports = router;