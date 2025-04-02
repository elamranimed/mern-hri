import React, { useState, useEffect } from "react"; 
import api from "./axiosConfig"; 
import AuthForm from "./components/AuthForm"; 
import ProduitForm from "./components/ProduitForm"; 
import ProduitList from "./components/ProduitList"; 
import "./App.css"; 

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || ""); 
  const [produits, setProduits] = useState([]); 
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (token) {
      api
        .get("/produits")
        .then((res) => setProduits(res.data))
        .catch(() => {
          setToken("");
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setProduits([]);
  };

  if (!token) {
    return (
      <div className="auth-container">
        <AuthForm setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="auth-container"> {/* Applique les mêmes couleurs qu'à la page de connexion */}
      <div className="auth-form"> {/* Style coloré similaire */}
        <h1>Mes Produits</h1>                
        <button onClick={logout} className="auth-button">Déconnexion</button> 

        <div className="profil-zone">
                    {user ? (
                      <div>
                        <h2>{user.profileName}</h2>
                        
                      </div>
                    ) : (
                      <p>Erreur : données de l'utilisateur non disponibles</p>
                    )}
                  </div>

        <ProduitForm setProduits={setProduits} />
        <ProduitList produits={produits} setProduits={setProduits} />
      </div>
    </div>
  );
}

export default App;
