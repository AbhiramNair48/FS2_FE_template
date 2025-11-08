import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../images/logo.png";
import cartlogo from "../images/cartlogo.png";

const NavBar = () => {
  const { itemCount } = useCart();

  return (
    <>
      <div className="nav">
        <div className="nav-items">
          <img className="icons" id="logo" src={logo} alt=""></img>
          <div className="search-container">
            <input
              type="text"
              className="search-box"
              placeholder="search"
            ></input>
            <button className="search-btn">search</button>
          </div>

          <Link to="/cart" id="cart-btn">
            Cart ({itemCount})
            <img src={cartlogo} alt=""></img>
          </Link>
        </div>
        <div id="links">
          <Link className="navlink" to="/">
            Home
          </Link>
          <Link className="navlink" to="/shopping">
            Shopping
          </Link>
          <Link className="navlink" to="/about">
            About Us
          </Link>
          <Link className="navlink" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;

