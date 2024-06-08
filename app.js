const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bank'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database.');
});

// Routes
app.get('/', (req, res) => {
  res.redirect('/customers');
});

// Read all customers
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) throw err;
    res.render('customers', { customers: results });
  });
});

// Create new customer
app.get('/customers/new', (req, res) => {
  res.render('newCustomer');
});

app.post('/customers', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO customers (name, email) VALUES (?, ?)', [name, email], (err) => {
    if (err) throw err;
    res.redirect('/customers');
  });
});

// Update customer
app.get('/customers/edit/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM customers WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.render('editCustomer', { customer: results[0] });
  });
});

app.post('/customers/edit/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.query('UPDATE customers SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
    if (err) throw err;
    res.redirect('/customers');
  });
});

// Delete customer
app.post('/customers/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM customers WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/customers');
  });
});

// Deposit money
app.post('/customers/deposit/:id', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  db.query('UPDATE customers SET balance = balance + ? WHERE id = ?', [amount, id], (err) => {
    if (err) throw err;
    res.redirect('/customers');
  });
});

// Withdraw money
app.post('/customers/withdraw/:id', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  db.query('UPDATE customers SET balance = balance - ? WHERE id = ? AND balance >= ?', [amount, id, amount], (err) => {
    if (err) throw err;
    res.redirect('/customers');
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});