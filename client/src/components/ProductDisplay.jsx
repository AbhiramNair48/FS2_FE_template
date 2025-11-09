import React, { useState, useEffect } from "react";
import Product from "./product";
import { useCart } from "../context/CartContext";
import axios from 'axios';

// Helper function to construct API URL
const constructApiUrl = (path) => {
  return `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}${path}`;
};

// Helper function to format product data
const formatProductData = (product) => ({
  id: product.id,
  image: product.imgPath ? `/productImages/${product.imgPath}` : '/productImages/default.png', // Default image if none provided
  name: product.productName,
  description: product.productDescription,
  price: product.productPrice
});

const ProductDisplay = ({
  limit = null,
  onAddToCart = null,
  alwaysShowButton = true,  // If true, always show the button; if false, only show when onAddToCart is provided
  apiUrl = '/api/products',
  loadingMessage = 'Loading products...',
  errorMessage = 'Failed to fetch products'
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart: contextAddToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(constructApiUrl(apiUrl));
        if (response.data.success) {
          let fetchedProducts = response.data.products.map(formatProductData);

          // Apply limit if specified
          if (limit) {
            fetchedProducts = fetchedProducts.slice(0, limit);
          }

          setProducts(fetchedProducts);
        } else {
          setError(errorMessage);
        }
      } catch (err) {
        setError(`${errorMessage}: ${err.message || 'Unknown error'}`);
        console.error(errorMessage + ':', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl, limit, errorMessage]); // Added apiUrl to dependency array to ensure fresh data when API changes

  if (loading) {
    return <div className="loading">{loadingMessage}</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="products-container horizontal-layout">
      {products.map((product) => (
        <div className="card horizontal-card" key={product.id}>
          <Product
            image={product.image}
            name={product.name}
            description={product.description}
            price={product.price}
          />
          {/* Show button based on alwaysShowButton prop or if onAddToCart is provided */}
          {(alwaysShowButton || onAddToCart !== null) && (
            <button 
              className="add-to-cart-btn" 
              onClick={() => {
                if (onAddToCart) {
                  onAddToCart(product);
                } else {
                  contextAddToCart(product);
                }
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductDisplay;