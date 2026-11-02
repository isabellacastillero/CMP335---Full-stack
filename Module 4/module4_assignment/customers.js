let mysql = require('mysql2');
let express = require('express');
 
let app = express();
app.use(express.json());
 
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "IsabellaL0603",   
  database: "mydb"
});
 
let TABLE = "customer_records";
 
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
 
  // Customer table: unique id, required name, email and phone
  let createTable =
    "CREATE TABLE IF NOT EXISTS " + TABLE + " (" +
    "id INT AUTO_INCREMENT PRIMARY KEY, " +
    "name VARCHAR(100) NOT NULL, " +
    "email VARCHAR(150), " +
    "phone VARCHAR(30))";
 
  con.query(createTable, function (err) {
    if (err) throw err;
    console.log("Table '" + TABLE + "' is ready");
 
    // Insert mock data only if the table is empty (no duplicates on restart)
    con.query("SELECT COUNT(*) AS total FROM " + TABLE, function (err, rows) {
      if (err) throw err;
      if (rows[0].total === 0) {
        let seed = "INSERT INTO " + TABLE + " (name, email, phone) VALUES ?";
        let mockData = [
          ["Ada Lovelace", "ada@example.com", "555-0101"],
          ["Grace Hopper", "grace@example.com", "555-0102"],
          ["Alan Turing", "alan@example.com", "555-0103"]
        ];
        con.query(seed, [mockData], function (err) {
          if (err) throw err;
          console.log("Mock data inserted");
        });
      }
    });
  });
});
 
// READ all
app.get('/customers', function (req, res) {
  con.query("SELECT * FROM " + TABLE, function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});
 
// READ one by id
app.get('/customers/:id', function (req, res) {
  con.query("SELECT * FROM " + TABLE + " WHERE id = ?", [req.params.id], function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Customer not found" });
    res.json(result[0]);
  });
});
 
// CREATE
app.post('/customers', function (req, res) {
  let { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  con.query(
    "INSERT INTO " + TABLE + " (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone],
    function (err, result) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name, email, phone });
    }
  );
});
 
// UPDATE by id
app.put('/customers/:id', function (req, res) {
  let { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  con.query(
    "UPDATE " + TABLE + " SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone, req.params.id],
    function (err, result) {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
      res.json({ id: Number(req.params.id), name, email, phone });
    }
  );
});
 
// DELETE by id
app.delete('/customers/:id', function (req, res) {
  con.query("DELETE FROM " + TABLE + " WHERE id = ?", [req.params.id], function (err, result) {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer " + req.params.id + " deleted" });
  });
});
 
app.get('/', function (req, res) {
  res.send("Customer service is running");
});
 
app.listen(3000, function () {
  console.log("Server running on http://localhost:3000");
});