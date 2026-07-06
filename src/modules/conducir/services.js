const HistorialService = require('../historial/services');
class ConducirService {
    static calcularDesdeUltimoHistorial(){
        const ultimo = HistorialService.getLast();
        if(!ultimo)
        {
            return {
                sinHistorial : true
            };
        }
        const bac_actual = ultimo.bac_final;
        if ( bac_actual <= 0.50)
        {
            return{
                    bac_actual,
                    puede_conducir : true,
                    horas_necesarias : 0,
                    mensaje: "Ya estas bajo el limite legal boliviano, ya puedes conducir"
                };
        }
        const horitas = Math.ceil(bac_actual/0.15);
        return{
            bac_actual,
            puede_conducir: false,
            horas_necesarias: horitas,
            mensaje: `Debes esperar ${horitas} horas antes de conducir legalmente en Bolivia `
        }
    }
}
module.exports = ConducirService;