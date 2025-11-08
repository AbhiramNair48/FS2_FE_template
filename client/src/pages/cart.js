import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, itemCount, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleRemoveItem = (product) => {
    removeFromCart(product);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      const item = items.find(item => item.id === productId);
      if (item) {
        removeFromCart(item);
      }
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div id="cart-container">
      <h1 id="cart-title">Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      
      {items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Go back to <Link to="/shopping">shopping</Link> to add some items!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((product) => (
              <div className="cart-item" key={product.id}>
                <div className="cart-item-info">
                  <img src={product.image} alt={product.name} onError={(e) => {
                    e.target.src = '/productImages/default.png'; // fallback image
                  }} />
                  <div className="cart-item-details">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="price">${typeof product.price === 'string' ? product.price.replace('$', '') : product.price}</div>
                  </div>
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{product.quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    ${(typeof product.price === 'string' 
                      ? parseFloat(product.price.replace('$', '')) 
                      : product.price || 0) * product.quantity}
                  </div>
                  
                  <button 
                    className="remove-btn" 
                    onClick={() => handleRemoveItem(product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="total">Total: ${getCartTotal().toFixed(2)}</div>
            <button 
              className="clear-cart-btn" 
              onClick={clearCart}
              disabled={items.length === 0}
            >
              Clear Cart
            </button>
            <button 
              className="checkout-btn" 
              disabled={items.length === 0}
            >
              Checkout
            </button>
          </div>
        </>
      )}
      
      <div className="continue-shopping">
        <Link to="/shopping">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default Cart;
