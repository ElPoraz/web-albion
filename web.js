require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_profiles LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur base de données');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur web lancé sur le port ${PORT}`));
