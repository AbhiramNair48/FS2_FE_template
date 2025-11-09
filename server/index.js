require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Using promise version for better async handling

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:3002", 
    "http://localhost:3003", 
    "http://localhost:3004", 
    "http://localhost:3005", 
    "http://localhost:3006"
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool configuration
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates required contact form fields
 * @param {Object} body - Request body containing form data
 * @returns {Object} - Validation result with success flag and error message if any
 */
const validateContactForm = (body) => {
  // Extract fields, supporting both camelCase (from frontend) and snake_case formats
  const firstName = body.first_name || body.firstname;
  const lastName = body.last_name || body.lastname;
  const email = body.email;
  const message = body.message || body.subject; // Support both 'message' and 'subject' fields

  // Validate required fields
  if (!firstName || !lastName || !email || !message) {
    return {
      success: false,
      error: 'Missing required fields. Please provide first name, last name, email, and message.'
    };
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return {
      success: false,
      error: 'Invalid email format.'
    };
  }

  return {
    success: true,
    data: { firstName, lastName, email, message }
  };
};

/**
 * Handles contact form submission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleContactSubmission = async (req, res) => {
  try {
    // Validate form data
    const validation = validateContactForm(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { firstName, lastName, email, message } = validation.data;

    // Create the SQL query using parameterized query to prevent SQL injection
    const sqlInsert = "INSERT INTO ecommerce.contact_information (first_name, last_name, email, message) VALUES (?, ?, ?, ?)";

    // Execute query to insert new contact information
    const [result] = await db.execute(sqlInsert, [firstName, lastName, email, message]);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully!',
      id: result.insertId
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again later.'
    });
  }
};

// POST route to handle inserting contact form submissions to the database
app.post('/api/insert', handleContactSubmission);

// Alternative cleaner route for contact form submissions
app.post('/api/contact', handleContactSubmission);

/**
 * Fetches products from the database
 * @param {string} query - SQL query to execute
 * @returns {Array} - Array of products
 */
const fetchProducts = async (query) => {
  try {
    const [result] = await db.execute(query);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch products. Please try again later.');
  }
};

// GET route to fetch all products from the database
app.get('/api/products', async (req, res) => {
  try {
    // Create the SQL query to fetch all products
    const sqlSelect = "SELECT id, imgPath, productName, productDescription, productPrice FROM ecommerce.products ORDER BY id";
    
    const products = await fetchProducts(sqlSelect);

    res.status(200).json({
      success: true,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET route to fetch random featured products
app.get('/api/featured', async (req, res) => {
  try {
    // Create the SQL query to fetch random products (limit 5)
    const sqlSelect = "SELECT id, imgPath, productName, productDescription, productPrice FROM ecommerce.products ORDER BY RAND() LIMIT 5";
    
    const products = await fetchProducts(sqlSelect);

    res.status(200).json({
      success: true,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;