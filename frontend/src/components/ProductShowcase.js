import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';

const ProductShowcase = () => {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await api.get('/produits/public'); // Appelle la route publique
        console.log(res.data); // AFFICHER LES DONNÉES DANS LA CONSOLE 
        setProduits(res.data); // Stocke les produits dans l'état local
      } catch (err) {
        console.error('Erreur lors de la récupération des produits :', err);
      }
    };

    fetchProduits(); // Appeler au montage du composant
  }, []);

  return (
    <div className="product-showcase">
      <h2>Produits disponibles</h2>     
      <div className="product-grid">
        {produits.map((produit) => (
          <div key={produit._id} className="product-item">
            <img src={`http://localhost:3000/${produit.image}`} alt={produit.title} style={{ width: '100px', height: '100px' }} />
            <strong>{produit.title}</strong>
            <p>Ajouté par : {produit.user?.fullName || 'Vendeur inconnu'}</p>
            <p>Numéro de téléphone : {produit.user?.phone || 'Non disponible'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;
