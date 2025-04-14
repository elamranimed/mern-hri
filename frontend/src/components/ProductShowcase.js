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
      <ul>
        
            {produits.map((produit) => (
        <li key={produit._id} className="product-item">
            <strong>{produit.title}</strong>
            <p>Ajouté par : {produit.user?.fullName || 'Vendeur inconnu'}</p>
            <p>Numéro de téléphone : {produit.user?.phone || 'Non disponible'}</p>
        </li>
        ))}

      </ul>
    </div>
  );
};

export default ProductShowcase;
