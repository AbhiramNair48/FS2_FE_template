const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: Configure mysql.createPool with your schema credentials from Lesson 9.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// POST route to handle inserting a new pokemon to the database
app.post('/api/insert', (req, res) => {

   // extracting the pokemon name and type from the request body
   const first_name = req.body.first_name;
   const last_name = req.body.last_name;
   const email = req.body.email;
   const message = req.body.message;

   //creating the sql query
   const sqlInsert = "INSERT INTO ecommerce.contact_information (first_name, last_name, email, message) VALUES (?,?,?,?)"

   //execute query to insert new pokemon
   db.query(sqlInsert, [first_name, last_name, email, message], (err, result)=> {
       console.log(err);
   })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
