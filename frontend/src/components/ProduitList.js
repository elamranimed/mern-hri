import React from "react"; 
import api from "../axiosConfig"; 

const ProduitList = ({ produits, setProduits }) => { 
    const deleteProduit = async (id) => { 
        if (!id) { alert("ID de produit invalide"); 
            
            return; 

        } try { await api.delete(`/produits/${id}`); 
        setProduits((prev) => prev.filter((produit) => produit._id !== id)); 
    } catch (err) { alert(err.response?.data?.message || "Erreur lors de la suppression"); 

    } 
}; 

return ( 
   <ul className="produit-list"> 
      {produits.map((produit) => ( 
        <li key={produit._id}> 
          {produit.title} 
          <button className="delete-button" onClick={() => deleteProduit(produit._id)}> 
          <span className="delete-button-text">Supprimer</span>
          </button>
          
        </li> 
       ))} 
   </ul> 
  ); 
}; 

export default ProduitList;
