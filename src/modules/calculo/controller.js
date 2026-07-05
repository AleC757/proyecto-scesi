const CalculoService = require('./services');
const { CalculoCreate, TiempoConducirCreate } = require('./schemas');

class CalculoController {
    static async calcular(req, res) {
        try {
            const parsed = CalculoCreate.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ 
                    error: parsed.error.issues[0].message 
                });
            }

            const resultado = await CalculoService.calcular(parsed.data);
            if (resultado.notFound) return res.status(404).json({ error: "bebida no encontrada" });
            res.json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                error: "Error interno del servidor" 
            });
        }
    }
}
module.exports = CalculoController;