import React, { useState, useEffect } from "react";
import Product from "./product";
import { useCart } from "../context/CartContext";
import axios from 'axios';

const ProductsList = ({ limit = null, onAddToCart = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart: contextAddToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}/api/products`);
        if (response.data.success) {
          let fetchedProducts = response.data.products.map(product => ({
            id: product.id,
            image: product.imgPath ? `/productImages/${product.imgPath}` : '/productImages/default.png', // Default image if none provided
            name: product.productName,
            description: product.productDescription,
            price: product.productPrice
          }));
          
          // Apply limit if specified
          if (limit) {
            fetchedProducts = fetchedProducts.slice(0, limit);
          }
          
          setProducts(fetchedProducts);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('Error fetching products: ' + err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

 if (loading) {
    return <div className="loading">Loading products...</div>;
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
          <button className="add-to-cart-btn" onClick={() => {
            if (onAddToCart) {
              onAddToCart(product);
            } else {
              contextAddToCart(product);
            }
          }}> Add to Cart </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;