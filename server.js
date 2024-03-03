require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => res.send('Customer API is running.'));

// Fetch customers with optional search, sorting, and pagination
app.get('/api/customers', async (req, res) => {
  const { search, sort = 'created_at', order = 'ASC', page = 1 } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;
  let searchQuery = '';
  let queryParams = [];

  if (search) {
      searchQuery = `WHERE customer_name ILIKE $1 OR location ILIKE $1`;
      queryParams.push(`%${search}%`);
  }

  queryParams.push(limit, offset); // Always add limit and offset as the last parameters

  const finalQuery = `
      SELECT sno, customer_name, age, phone, location,
      TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
      TO_CHAR(created_at, 'HH24:MI:SS') AS time
      FROM customers
      ${searchQuery}
      ORDER BY ${sort} ${order} LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
  `;

  try {
      const { rows } = await pool.query(finalQuery, queryParams);
      res.json(rows);
  } catch (err) {
      console.error('Database error:', err.message);
      res.status(500).send('Server error');
  }
});


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
