const express = require('express');
const router = express.Router();
const Product = require('../models/produit');
const auth = require('../middleware/auth');

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
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product({ title: req.body.title, user: req.user.id });
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

module.exports = router;
