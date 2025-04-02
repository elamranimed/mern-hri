import React, { useState } from "react"; 
import api from "../axiosConfig"; 

const ProduitForm = ({ setProduits }) => { 
    const [newProduit, setNewProduit] = useState(""); 
    
    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        if (!newProduit) return; 
        try { 
            const res = await api.post("/produits", { title: newProduit }); 
            setProduits((prev) => [...prev, res.data]); 
            setNewProduit(""); 
        } catch (err) { 
            alert("Erreur lors de l’ajout du produit"); 
        } 
    }; 

    return ( 
        <form onSubmit={handleSubmit} className="produit-form"> 
            <input 
                className="produit-input" /* La classe pour appliquer le style fond blanc */
                value={newProduit} 
                onChange={(e) => setNewProduit(e.target.value)} 
                placeholder="Nouveau produit" 
                required 
            /> 
            <button type="submit" style={{ backgroundColor: 'transparent', color: '#00FF00', fontWeight: 'bold', border: 'none' }}>Ajouter</button> 
        </form> 
    ); 
}; 

export default ProduitForm;
