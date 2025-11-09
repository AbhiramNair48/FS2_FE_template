import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Helper function to extract numeric price from string
const extractPrice = (price) => {
  if (typeof price === 'string') {
    return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
  }
  return price || 0;
};

// Cart reducer to handle different cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);

      if (existingItemIndex >= 0) {
        // If item already exists, increase quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };

        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + 1,
          total: state.total + extractPrice(updatedItems[existingItemIndex].price)
        };
      } else {
        // If new item, add it to cart
        const newItem = {
          ...action.payload,
          quantity: 1
        };

        return {
          ...state,
          items: [...state.items, newItem],
          itemCount: state.itemCount + 1,
          total: state.total + extractPrice(newItem.price)
        };
      }

    case 'REMOVE_FROM_CART':
      const itemToRemoveIndex = state.items.findIndex(item => item.id === action.payload.id);

      if (itemToRemoveIndex >= 0) {
        const item = state.items[itemToRemoveIndex];
        const itemTotal = extractPrice(item.price) * item.quantity;
        const updatedItems = state.items.filter((_, index) => index !== itemToRemoveIndex);

        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount - item.quantity,
          total: state.total - itemTotal
        };
      }

      return state;

    case 'UPDATE_QUANTITY':
      const itemToUpdateIndex = state.items.findIndex(item => item.id === action.payload.id);

      if (itemToUpdateIndex >= 0) {
        const item = state.items[itemToUpdateIndex];
        const newQuantity = action.payload.quantity;
        const itemPrice = extractPrice(item.price);
        const currentTotal = itemPrice * item.quantity;
        const newTotal = itemPrice * newQuantity;
        const totalDiff = newTotal - currentTotal;
        
        const updatedItems = [...state.items];

        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          updatedItems.splice(itemToUpdateIndex, 1);
          return {
            ...state,
            items: updatedItems,
            itemCount: state.itemCount - item.quantity,
            total: state.total - currentTotal
          };
        } else {
          // Update quantity
          updatedItems[itemToUpdateIndex] = {
            ...updatedItems[itemToUpdateIndex],
            quantity: newQuantity
          };

          return {
            ...state,
            items: updatedItems,
            itemCount: state.itemCount + (newQuantity - item.quantity),
            total: state.total + totalDiff
          };
        }
      }

      return state;

    case 'LOAD_CART':
      return action.payload;

    case 'CLEAR_CART':
      return {
        items: [],
        itemCount: 0,
        total: 0
      };

    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    itemCount: 0,
    total: 0 
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Ensure cart state has the correct structure with total
        const cartWithTotal = {
          ...parsedCart,
          total: parsedCart.items.reduce((sum, item) => {
            const price = extractPrice(item.price);
            return sum + (price * (item.quantity || 1));
          }, 0)
        };
        dispatch({ type: 'LOAD_CART', payload: cartWithTotal });
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
        // Initialize with empty cart if parsing fails
        dispatch({ type: 'LOAD_CART', payload: { items: [], itemCount: 0, total: 0 } });
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Function to add item to cart
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  // Function to remove item from cart
  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  // Function to update item quantity
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  // Function to clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Function to get cart total price (kept for backward compatibility)
  const getCartTotal = () => {
    return state.total;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};