const path = require('path');

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir les photos

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MongoDB URI is undefined. Check your environment variables.");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error('Erreur MongoDB:', err));

// Ajouter les routes
const authRoutes = require('./routes/auth');  // Auth et gestion utilisateur dans le même fichier
const produitRoutes = require("./routes/produits");
const userRoutes = require("./routes/users");


app.use('/api/auth', authRoutes); 
app.use("/api/produits", produitRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));