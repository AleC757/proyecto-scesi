require('dotenv').config();
const { generarConsejo } = require('./llm');
const express = require('express');
const app = express();
app.use(express.json());

const db = require('./src/core/database');

const { calcularBAC,TiempoEntreTrago, vasos_maximos, SobriedadEnCuanto } = require('./widmark');

app.listen(3000,()=> {
    console.log('Servidor ejecuntadose en puerto 3000');
});

app.get('/',(req, res) =>{
    res.send('Hola mundo');
});

app.get('/bebidas',(req,res)=>
{
    const bebidas= db.prepare('SELECT * FROM bebidas').all();
    res.json(bebidas);
})
app.get('/bebidas/:id',(req, res) =>
{
    const id = parseInt(req.params.id);
    const bebida = db.prepare('SELECT * FROM bebidas WHERE id = ?').get(id);
    if(!bebida)
    {
        return res.status(404).json({
            error:" bebida no encontrada"
        }
        );
    }
    res.json(bebida);
}
);

app.post("/calcular", async (req,res) =>
{
    try{
    const {peso, sexo, comio_antes, horasEvento , vasos_planificados, bebida_id} = req.body;
    if(!peso||!sexo||!horasEvento||!bebida_id||!comio_antes||!vasos_planificados)
    {
        return res.status(400).json(
            {
                "error":"faltan datos"
            }
        );
    }
    if(typeof peso != "number" || Number.isNaN(peso)  ||peso<0)
    {
        return res.status(400).json(
            {
                error: " El peso debe ser un número valido y mayor a 0"
            }
        );
    }
    if(typeof horasEvento != "number"|| Number.isNaN(horasEvento)|| horasEvento<0)
    {
        return res.status(400).json(
            {
                error: "Las horas deben ser un número valido y mayor a 0"
            }
        );
    }
    if(sexo !== "M" && sexo !== "F" )
    {
        return res.status(400).json(
            {
                error:"Sexo debe ser M o F."
            }
        );
    }    
    const bebida = db.prepare('SELECT * FROM bebidas WHERE id = ?').get(bebida_id);
    if(!bebida)
    {
        return res.status(404).json({
            error:" bebida no encontrada"
        }
        )
    }
    if(comio_antes !== "SI" && comio_antes !== "NO" )
    {
        return res.status(400).json(
            {
                error: "La respuesta de ser SI o NO"
            }
        );
    }

    if(typeof vasos_planificados != "number" || Number.isNaN(vasos_planificados)  ||vasos_planificados<0)
    {
        return res.status(400).json({
            error: "Los vasos planificados deben ser un numero valido y mayor a 0"
        });
    }
    const bacxvaso = calcularBAC(peso, sexo, bebida.graduacion, bebida.volumen_ml, comio_antes);
    const max_vasos = vasos_maximos(bacxvaso);
    const ritmo_minutos= TiempoEntreTrago(bacxvaso);
    const simulacion = SobriedadEnCuanto(vasos_planificados, bacxvaso,horasEvento )
    const plan_es_seguro = vasos_planificados <= max_vasos;
    const consejo = await generarConsejo({
            peso, sexo, comio_antes, horasEvento,
            bebida: bebida.nombre, vasos_planificados, max_vasos, ritmo_minutos,
            bac_final: simulacion.bacFinal,
            plan_es_seguro
        });

    

    db.prepare(`
        INSERT INTO historial (peso, sexo, comio_antes, horas_evento, bebida_nombre,
         vasos_planificados, bac_final, plan_es_seguro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(peso, sexo, comio_antes, horasEvento, bebida.nombre, vasos_planificados,
         simulacion.bacFinal, plan_es_seguro ? 1 : 0);
    
    res.json({
        bebida: bebida.nombre,
        plan_usuario: {
                vasos_planificados,
                plan_es_seguro,
                vasos_maximos_recomendados: vasos_maximos
        },
        estrategia_ritmo: {
                minutos_entre_vasos: ritmo_minutos,
                descripcion: `Toma un vaso cada ${ritmo_minutos} minutos para metabolizar correctamente`
            },
            simulacion_plan: {
                bac_estimado_final: simulacion.bacFinal,
                horas_totales_para_sobriedad: simulacion.horasTotalesParaCero,
                bajo_limite_legal: simulacion.bacFinal <= 0.50
            },
        consejo
    });
    } catch (error)
    {
        console.error(error);
        res.status(500).json(
            {
                error: "Error interno del servidor"
            }
        )
    }
});

app.post('/tiempo-para-conducir',(req,res) => {
    const{ bac_actual} = req.body;
    if(bac_actual === undefined || bac_actual === null)
    {
        return res.status(400).json({
            error : "Falta bac_actual."
        });
    }
    if(bac_actual <0 )
    {
        return res.status(400).json(
            {erro: "El BAC no puede ser negativo."}
        );
    }
    if(bac_actual <= 0.50)
    {
        return res.json(
            {
                bac_actual,
                puede_conducir:true,
                horas_necesarias: 0,
                mensaje: "Ya estás bajo el limite legal boliviano. Puedes conducir."
            }
        );
    }
    const horitas = (bac_actual- 0.50)/0.015;
    res.json({
        bac_actual,
        puede_conducir: false,
        horas_necesarias: Number(horitas.toFixed(2)),
        mensaje : 'Debes esperar ${horitas} horas antes de condicir legalmente en Bolivia'
    });
});

app.get("/historial",(req,res) =>
{
    const registros = db.prepare(`
        SELECT * FROM historial
        ORDER BY fecha DESC

`).all();
    res.json(registros);
});