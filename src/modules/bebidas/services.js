const db = require('../../core/database')
class BebidaService {
    static getAll()
    {
        return db.prepare('SELECT * FROM bebidas').all();
    }
    static getById(id)
    {
        return db.prepare('SELECT * FROM bebidas WHERE id = ? ').get(id);
    }

    static create({ nombre, graduacion, volumen_ml }) {
    const result = db.prepare(`
        INSERT INTO bebidas (nombre, graduacion, volumen_ml) VALUES (?, ?, ?)
    `).run(nombre, graduacion, volumen_ml);
    return this.getById(result.lastInsertRowid);
    }

    static createMezcla({ nombre, ingredientes }) {
    let volumen_total = 0;
    let alcohol_total = 0;

    for (const ingrediente of ingredientes) {
        volumen_total += ingrediente.volumen_ml;
        alcohol_total += (ingrediente.volumen_ml * ingrediente.graduacion) / 100;
    }

    const graduacion_final = Number(((alcohol_total / volumen_total) * 100).toFixed(2));

    return this.create({ 
        nombre, 
        graduacion: graduacion_final, 
        volumen_ml: volumen_total 
    });
    }

    static update(id, datos) {
    let fragmentosSQL = [];
    let valores = [];

    for (const propiedad in datos) {
        fragmentosSQL.push(propiedad + " = ?");
        valores.push(datos[propiedad]);
    }

    const sets = fragmentosSQL.join(', ');

    valores.push(id);
    db.prepare("UPDATE bebidas SET " + sets + " WHERE id = ?").run(valores);

    return this.getById(id);
    }

    static delete(id) {
    return db.prepare('DELETE FROM bebidas WHERE id = ?').run(id);
}
}
module.exports = BebidaService;