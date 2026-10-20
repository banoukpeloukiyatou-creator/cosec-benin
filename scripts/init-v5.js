const pool = require('../config/database');

async function creerTableAgents() {
  console.log("Création table agents V5...");
  const sql = `
    CREATE TABLE IF NOT EXISTS agents (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      telephone VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100),
      agence_id INT NOT NULL,
      agence_nom VARCHAR(50) NOT NULL,
      role VARCHAR(20) DEFAULT 'agent',
      mot_de_passe_hash VARCHAR(255) NOT NULL,
      est_actif BOOLEAN DEFAULT true,
      cree_le TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(sql);
  console.log("✅ Table agents créée avec succès Maître !");
  process.exit(0);
}

creerTableAgents();