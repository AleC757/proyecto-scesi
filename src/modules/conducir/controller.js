const ConducirService = require('./services')

class ConducirController {
    static tiempoParaConducir(req,res){
        const resultado = ConducirService.calcularDesdeUltimoHistorial;
        if(resultado.sinHistorial){
            return res.status(404).json
            {
                error: "no hay registros en el historial"
            };
        }
        return res.json(resultado);
    }   
}
module.exports = ConducirController;