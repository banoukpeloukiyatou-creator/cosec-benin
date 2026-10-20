const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur connexion DB:', err.stack);
  } else {
    console.log('✅ Connecté à PostgreSQL Render');
    release();
  }
});

// ===== ROUTES API =====

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'COSEC Benin API V5 OK', status: '7.5M ready' });
});

// Route AGENTS - V5
app.get('/api/agents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agents ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur agents', details: err.message });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const { nom, prenom, matricule, poste, departement } = req.body;
    const result = await pool.query(
      'INSERT INTO agents (nom, prenom, matricule, poste, departement) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nom, prenom, matricule, poste, departement]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour gérer les 7.5M et autres données
app.get('/api/stats', async (req, res) => {
  try {
    res.json({ 
      budget_total: 7500000,
      version: 'V5',
      status: 'Actif'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 COSEC Benin V5 lancé sur port ${PORT}`);
  console.log(`✅ Prêt pour gestion 7.5M`);
});