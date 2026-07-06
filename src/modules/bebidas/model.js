const db = require('../../core/database');

db.exec(`
    CREATE TABLE IF NOT EXISTS bebidas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        graduacion REAL NOT NULL,
        volumen_ml INTEGER NOT NULL
    )
`);

const cantidad = db.prepare('SELECT COUNT(*) as total FROM bebidas').get();
if (cantidad.total === 0) {
    const insertar = db.prepare(`INSERT INTO bebidas (nombre, graduacion, volumen_ml) VALUES (?, ?, ?)`);
    insertar.run('Paceña', 4.8, 355);
    insertar.run('Singani', 40, 50);
    insertar.run('Fernet', 39, 50);
    insertar.run('Chicha', 5, 300);
    insertar.run('Sucumbé', 15, 100);
    insertar.run('Four Loko', 12, 473);
    console.log('Bebidas insertadas correctamente');
}