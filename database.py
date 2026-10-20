# database.py - BASE MICROFINANCE COSEC EN PYTHON
import sqlite3
from datetime import datetime
import os

DB_NAME = "cosec_microfinance.db"

def creer_base():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    # 1. MEMBRES
    cur.execute("""
    CREATE TABLE IF NOT EXISTS membres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_compte TEXT UNIQUE,
        nom_complet TEXT,
        telephone TEXT,
        whatsapp TEXT,
        adresse TEXT,
        date_adhesion TEXT,
        statut TEXT DEFAULT 'ACTIF'
    )""")

    # 2. COMPTES MICROFINANCE - LE COEUR
    cur.execute("""
    CREATE TABLE IF NOT EXISTS comptes_microfinance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        membre_id INTEGER,
        type_compte TEXT, -- EPARGNE, TONTINE_JOURNALIERE, CREDIT
        numero_compte TEXT,
        solde_actuel REAL DEFAULT 0,
        montant_jour REAL DEFAULT 1000,
        jours_total INTEGER DEFAULT 31,
        jours_payes INTEGER DEFAULT 0,
        FOREIGN KEY(membre_id) REFERENCES membres(id)
    )""")

    # 3. TRANSACTIONS - PAIEMENT, ENCAISSEMENT, REMBOURSEMENT
    cur.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compte_id INTEGER,
        type_operation TEXT, -- PAIEMENT, ENCAISSEMENT, REMBOURSEMENT
        montant REAL,
        numero_recu TEXT UNIQUE, -- RC-P-..., RC-E-..., RC-R-...
        ancien_solde REAL,
        nouveau_solde REAL,
        mode_paiement TEXT DEFAULT 'ESPECES',
        agent_id INTEGER,
        date_operation TEXT,
        qr_code TEXT,
        FOREIGN KEY(compte_id) REFERENCES comptes_microfinance(id)
    )""")

    # 4. CREDITS
    cur.execute("""
    CREATE TABLE IF NOT EXISTS credits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        membre_id INTEGER,
        montant_accorde REAL,
        reste_a_payer REAL,
        statut TEXT DEFAULT 'EN_COURS',
        FOREIGN KEY(membre_id) REFERENCES membres(id)
    )""")

    # 5. AGENTS
    cur.execute("""
    CREATE TABLE IF NOT EXISTS agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        telephone TEXT,
        zone TEXT,
        code_pin INTEGER
    )""")

    # 6. RECUS_PDF
    cur.execute("""
    CREATE TABLE IF NOT EXISTS recus_pdf (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER,
        numero_recu TEXT,
        chemin_pdf TEXT,
        envoye_whatsapp INTEGER DEFAULT 0,
        date_envoi TEXT,
        FOREIGN KEY(transaction_id) REFERENCES transactions(id)
    )""")

    conn.commit()
    conn.close()
    print("✅ BASE COSEC CRÉÉE AVEC SUCCÈS : cosec_microfinance.db")

# LANCER LA CRÉATION
if __name__ == "__main__":
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME)
    creer_base()