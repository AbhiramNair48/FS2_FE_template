import React from "react";
import ProductDisplay from "./ProductDisplay";

const FeaturedProducts = ({ limit = 5, onAddToCart = null }) => {
  return (
    <ProductDisplay 
      limit={limit}
      onAddToCart={onAddToCart}
      alwaysShowButton={false}  // Featured products only show button when onAddToCart is provided
      apiUrl="/api/featured"
      loadingMessage="Loading featured products..."
      errorMessage="Failed to fetch featured products"
    />
  );
};

export default FeaturedProducts;