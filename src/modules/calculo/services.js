const db = require('../../core/database');
const BebidaService = require('../bebidas/services');
const { calcularBAC, TiempoEntreTrago, vasos_maximos, SobriedadEnCuanto } = require('./widmark');
const { generarConsejo } = require('./llm');

class CalculoService {
    static async calcular(datos) {
        const { peso, sexo, comio_antes, horasEvento, vasos_planificados, bebida_id } = datos;
        const bebida = BebidaService.getById(bebida_id);
        if (!bebida) return { notFound: true };

        const bacxvaso = calcularBAC(peso, sexo, bebida.graduacion, bebida.volumen_ml, comio_antes);
        const max_vasos = vasos_maximos(bacxvaso);
        const ritmo_minutos = TiempoEntreTrago(bacxvaso);
        const simulacion = SobriedadEnCuanto(vasos_planificados, bacxvaso, horasEvento);
        const plan_es_seguro = vasos_planificados <= max_vasos;

        const consejo = await generarConsejo({
            peso, sexo, comio_antes, horasEvento,
            bebida: bebida.nombre, vasos_planificados, max_vasos, ritmo_minutos,
            bac_final: simulacion.bacFinal, plan_es_seguro
        });

        db.prepare(`
            INSERT INTO historial (peso, sexo, comio_antes, horas_evento, bebida_nombre,
             vasos_planificados, bac_final, plan_es_seguro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(peso, sexo, comio_antes, horasEvento, bebida.nombre, vasos_planificados,
             simulacion.bacFinal, plan_es_seguro ? 1 : 0);

        return {
            bebida: bebida.nombre,
            plan_usuario: { vasos_planificados, plan_es_seguro, vasos_maximos_recomendados: max_vasos },
            estrategia_ritmo: {
                minutos_entre_vasos: ritmo_minutos,
                descripcion: `Toma un vaso cada ${ritmo_minutos} minutos para metabolizar correctamente`
            },
            simulacion_plan: {
                  bac_pico_estimado: Number((vasos_planificados * bacxvaso).toFixed(3)),
                 bac_estimado_final: simulacion.bacFinal,
                 horas_totales_para_sobriedad: simulacion.horasTotalesParaCero,
                     bajo_limite_legal: simulacion.bacFinal <= 0.50
            },
            consejo
        };
    }
}
module.exports = CalculoService;