import React, { useState } from "react"; 
import api from "../axiosConfig"; 

const ProduitForm = ({ setProduits }) => { 
    const [newProduit, setNewProduit] = useState({   //Modification de l'état ("") pour inclure l'image
        title: "", 
        image: null, 
      }); 
    
    // Modification de la fonction handleSubmit pour envoyer les données sous forme de FormData
  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!newProduit.title || !newProduit.image) return; // -->
    // Création d'un objet FormData pour envoyer les données
    const formData = new FormData(); // -->
    formData.append("title", newProduit.title); 
    
    const filename = `${Date.now()}-${newProduit.image.name}`; //Générer un nom unique pour l'image
    formData.append("image", newProduit.image); 
    try {
      // Envoi des données avec les headers appropriés
      const res = await api.post("/produits", formData, { // -->
        headers: { // -->
          "Content-Type": "multipart/form-data", // -->
        }, // -->
      });
      setProduits((prev) => [...prev, res.data]);
      setNewProduit({ title: "", image: null }); // -->
    } catch (err) {
      alert("Erreur lors de l’ajout du produit");
    }
  };

  // fonction pour gérer le changement d'image
  const handleImageChange = (e) => { // -->
    setNewProduit({ ...newProduit, image: e.target.files[0] }); // -->
  };

  return (
    <form onSubmit={handleSubmit} className="produit-form">
      <input
        className="produit-input"
        value={newProduit.title}
        // fonction onChange pour mettre à jour l'état
        onChange={(e) => setNewProduit({ ...newProduit, title: e.target.value })} // -->
        placeholder="Nouveau produit"
        required
      />
      sélectionner l'image du produit
      <input 
        type="file" 
        onChange={handleImageChange} 
        required 
      />
      <button
        type="submit"
        style={{
          backgroundColor: "transparent",
          color: "#00FF00",
          fontWeight: "bold",
          border: "none",
        }}
      >
        Ajouter
      </button>
    </form>
  );
};

export default ProduitForm;