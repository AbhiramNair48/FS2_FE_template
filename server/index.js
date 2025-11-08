console.log('Loaded DB_USER:', process.env.DB_USER);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006"],
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure mysql.createPool with schema credentials
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// POST route to handle inserting contact form submissions to the database
app.post('/api/insert', (req, res) => {
  // Extract fields, supporting both camelCase (from frontend) and snake_case formats
  const first_name = req.body.first_name || req.body.firstname;
  const last_name = req.body.last_name || req.body.lastname;
  const email = req.body.email;
  const message = req.body.message || req.body.subject; // Support both 'message' and 'subject' fields

  // Validate required fields
  if (!first_name || !last_name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields. Please provide first name, last name, email, and message.'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format.'
    });
  }

  // Create the SQL query
  const sqlInsert = "INSERT INTO ecommerce.contact_information (first_name, last_name, email, message) VALUES (?,?,?,?)";

  // Execute query to insert new contact information
  db.query(sqlInsert, [first_name, last_name, email, message], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit contact form. Please try again later.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully!',
      id: result.insertId
    });
  });
});

// Alternative cleaner route for contact form submissions
app.post('/api/contact', (req, res) => {
  // Extract fields, supporting both camelCase (from frontend) and snake_case formats
  const first_name = req.body.first_name || req.body.firstname;
  const last_name = req.body.last_name || req.body.lastname;
  const email = req.body.email;
  const message = req.body.message || req.body.subject; // Support both 'message' and 'subject' fields

  // Validate required fields
  if (!first_name || !last_name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields. Please provide first name, last name, email, and message.'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format.'
    });
  }

  // Create the SQL query
  const sqlInsert = "INSERT INTO ecommerce.contact_information (first_name, last_name, email, message) VALUES (?,?,?,?)";

  // Execute query to insert new contact information
  db.query(sqlInsert, [first_name, last_name, email, message], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit contact form. Please try again later.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully!',
      id: result.insertId
    });
  });
});

// GET route to fetch all products from the database
app.get('/api/products', (req, res) => {
  // Create the SQL query to fetch all products
   const sqlSelect = "SELECT id, imgPath, productName, productDescription, productPrice FROM ecommerce.products ORDER BY id";

  // Execute query to fetch products
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch products. Please try again later.'
      });
    }
    
    res.status(200).json({
      success: true,
      products: result
    });
  });
});

// GET route to fetch random featured products
app.get('/api/featured', (req, res) => {
  // Create the SQL query to fetch random products (limit 5)
   const sqlSelect = "SELECT id, imgPath, productName, productDescription, productPrice FROM ecommerce.products ORDER BY RAND() LIMIT 5";

  // Execute query to fetch random products
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch featured products. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      products: result
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
