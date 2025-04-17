const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Produit", produitSchema);