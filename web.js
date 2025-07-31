require('dotenv').config();
const express = require('express');
const basicAuth = require('basic-auth');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware d'authentification simple
app.use((req, res, next) => {
  const user = basicAuth(req);
  if (
    user &&
    user.name === process.env.AUTH_USER &&
    user.pass === process.env.AUTH_PASS
  ) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Accès restreint"');
  return res.status(401).send('Accès refusé');
});

// Route principale
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_profiles ORDER BY attendances DESC');
    res.render('table', { data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur base de données');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur web lancé sur le port ${PORT}`));
