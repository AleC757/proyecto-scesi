const db = require('../../core/database');
class HistorialService {
    static getAll(){
        return db.prepare(`SELECT * FROM historial ORDER BY fecha DESC`).all();
    }
}
module.exports = HistorialService;

