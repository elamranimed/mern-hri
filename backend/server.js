const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const Grid = require('gridfs-stream');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir les photos si nécessaire

// Connexion MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MongoDB URI is undefined. Check your environment variables.");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error('Erreur MongoDB:', err));

let gfs, gridfsBucket;

mongoose.connection.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads'); // Configure le bucket pour GridFS
});

// Configuration GridFS pour le stockage des fichiers
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads', // Collection associée
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// Routes existantes
const authRoutes = require('./routes/auth');  // Auth et gestion utilisateur dans le même fichier
const produitRoutes = require("./routes/produits");
const userRoutes = require("./routes/users");

app.use('/api/auth', authRoutes); 
app.use("/api/produits", produitRoutes);
app.use("/api/user", userRoutes);

// Nouvelle route pour télécharger des images
app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ file: req.file });
});

// Nouvelle route pour récupérer une image
app.get('/api/file/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file || (file.contentType !== 'image/jpeg' && file.contentType !== 'image/png')) {
      return res.status(404).send('Fichier introuvable ou type incorrect.');
    }

    // Configure le type MIME pour l'image
    res.set('Content-Type', file.contentType);
    
    const readStream = gridfsBucket.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération du fichier.');
  }
});

// Serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
