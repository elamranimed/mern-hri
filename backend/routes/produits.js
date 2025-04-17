const express = require('express');
const router = express.Router();
const Product = require('../models/produit');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Récupérer les produits de l'utilisateur connecté
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter un produit
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    const product = new Product({ title: req.body.title, image: req.file.path , user: req.user.id });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un produit
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé ou non autorisé' });
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});


// Récupérer tous les produits enregistrés (route publique)
router.get('/public', async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'fullName phone'); // Populer pour afficher le nom complet de l'utilisateur et Tel, si besoin
    res.json(products);
  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des produits' });
  }
});

module.exports = router;
