import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Charger la wishlist depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        // Vérifier que c'est bien un tableau
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        } else {
          // Si ce n'est pas un tableau, réinitialiser
          localStorage.setItem("wishlist", JSON.stringify([]));
          setWishlist([]);
        }
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      localStorage.setItem("wishlist", JSON.stringify([]));
      setWishlist([]);
    }
  }, []);

  // Sauvegarder la wishlist dans localStorage à chaque changement
  useEffect(() => {
    if (wishlist.length >= 0) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Ajouter un produit à la wishlist
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      // Vérifier si le produit existe déjà
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev; // Ne rien faire si déjà dans la wishlist
      }
      return [...prev, product];
    });
  };

  // Retirer un produit de la wishlist
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  // Vérifier si un produit est dans la wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  // Vider la wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.setItem("wishlist", JSON.stringify([]));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
