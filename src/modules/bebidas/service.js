const db = requiere('../../core/database')
class BebidaService {
    static getAll()
    {
        return db.prepare('SELECT FROM * bebidas').all();
    }
    static getById(id)
    {
        return db.prepare('SELECT FOROM * bebidas WHERE id = ? ').get(id);
    }
}
module.exports = BebidaService;