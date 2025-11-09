import React from "react";

// Helper function to extract numeric price from string
const extractPrice = (price) => {
  if (typeof price === 'string') {
    return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
  }
  return price || 0;
};

const Product = ({ image, name, description, price }) => {
  return (
    <div className="product-card" id="product">
      <img 
        src={image} 
        alt={name || "Product"} 
        onError={(e) => {
          e.target.src = '/productImages/default.png'; // fallback image
        }} 
      />
      <h2> {name} </h2>
      <h3> {description} </h3>
      <h3> ${extractPrice(price).toFixed(2)} </h3>
    </div>
  );
};

export default Product;
