import React, { useState, useEffect } from "react";
import Product from "./product";
import axios from 'axios';

const FeaturedProducts = ({ limit = 5, onAddToCart = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}/api/featured`);
        if (response.data.success) {
          const fetchedProducts = response.data.products.map(product => ({
            id: product.id,
            image: product.imgPath ? `/productImages/${product.imgPath}` : '/productImages/default.png', // Default image if none provided
            name: product.productName,
            description: product.productDescription,
            price: product.productPrice
          }));

          setProducts(fetchedProducts);
        } else {
          setError('Failed to fetch featured products');
        }
      } catch (err) {
        setError('Error fetching featured products: ' + err.message);
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading featured products...</div>;
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
          {onAddToCart && (
            <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}> Add to Cart </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;