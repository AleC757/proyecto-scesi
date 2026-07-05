const db = require('../../core/database');
class HistorialService {
    static getAll(){
        return db.prepare(`SELECT * FROM historial ORDER BY fecha DESC`).all();
    }
    static getLast()
    {
        return db.prepare(`SELECT * FROM historial ORDER BY fecha DESC LIMIT 1`).get();
    }
}
module.exports = HistorialService;

