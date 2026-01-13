import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Vérifier si le produit existe déjà (même ID et même couleur)
      const existingItemIndex = prevCart.findIndex(
        item => item._id === product._id && item.selectedColor === product.selectedColor
      );

      if (existingItemIndex > -1) {
        // Produit existe déjà, augmenter la quantité
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += product.quantity || 1;
        return updatedCart;
      } else {
        // Nouveau produit
        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (productId, selectedColor) => {
    setCart((prevCart) =>
      prevCart.filter(item => 
        !(item._id === productId && item.selectedColor === selectedColor)
      )
    );
  };

  const updateQuantity = (productId, selectedColor, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item._id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
