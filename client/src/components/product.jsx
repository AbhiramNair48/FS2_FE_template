import React from "react";

const Product = (props) => {
  return (
    <div className="product-card" id="product">
      <img src={props.image} alt={props.name || "Product"} onError={(e) => {
        e.target.src = '/productImages/default.png'; // fallback image
      }} />
      <h2> {props.name} </h2>
      <h3> {props.description} </h3>
      <h3> {props.price} </h3>
    </div>
  );
};

export default Product;
