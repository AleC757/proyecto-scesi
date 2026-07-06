const db = require('../../core/database');

db.exec(`
    CREATE TABLE IF NOT EXISTS historial (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        peso REAL NOT NULL,
        sexo TEXT NOT NULL,
        comio_antes TEXT NOT NULL,
        horas_evento REAL NOT NULL,
        bebida_nombre TEXT NOT NULL,
        vasos_planificados INTEGER NOT NULL,
        bac_final REAL NOT NULL,
        plan_es_seguro INTEGER NOT NULL,
        fecha TEXT DEFAULT (datetime('now', 'localtime'))
    )
`);