const Database = require('better-sqlite3');
const db = Database('Alcohol.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS bebidas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        graduacion REAL NOT NULL,
        volumen_ml INTEGER NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS historial (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        peso REAL NOT NULL,
        sexo TEXT NOT NULL,
        horas REAL NOT NULL,
        bebida_nombre TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        bac REAL NOT NULL,
        vasos_maximos INTEGER NOT NULL,
        bajo_limite_legal INTEGER NOT NULL,
        fecha TEXT DEFAULT (datetime('now', 'localtime'))
    )
`);

const cantidad = db.prepare('SELECT COUNT(*) as total FROM bebidas').get();

if (cantidad.total === 0) {
    const insertar = db.prepare(`
        INSERT INTO bebidas (nombre, graduacion, volumen_ml)
        VALUES (?, ?, ?)
    `);
    insertar.run('Paceña', 4.8, 355);
    insertar.run('Singani', 40, 50);
    insertar.run('Fernet', 39, 50);
    insertar.run('Chicha', 5, 300);
    insertar.run('Sucumbé', 15, 100);
    insertar.run('Four Loko', 12, 473);
    console.log('Bebidas insertadas correctamente');
}

module.exports = db;