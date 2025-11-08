import React from "react";
import "./styling/App.css";
import "./styling/nav.css";
import "./styling/footer.css";
import "./styling/home.css";
import "./styling/shopping.css";
import "./styling/about.css";
import "./styling/account.css";
import "./styling/contact.css";
import "./styling/hero.css";
import "./styling/featured.css";
import "./styling/cart.css";

import { CartProvider } from "./context/CartContext";

import About from "./pages/about";
import Account from "./pages/account";
import Cart from "./pages/cart";
import Contact from "./pages/contact";
import Shopping from "./pages/shopping";
import Home from "./pages/home";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NavBar } from "./components/index.js";
import { Footer } from "./components/index.js";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="main">
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shopping" element={<Shopping />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
