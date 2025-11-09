import React from "react";
import ProductDisplay from "./ProductDisplay";

const ProductsList = ({ limit = null, onAddToCart = null }) => {
  return (
    <ProductDisplay
      limit={limit}
      onAddToCart={onAddToCart}
      alwaysShowButton={true}
      apiUrl="/api/products"
      loadingMessage="Loading products..."
      errorMessage="Failed to fetch products"
    />
  );
};

export default ProductsList;