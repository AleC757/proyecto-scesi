const express = require('express');
const app = express();
app.use(express.json());

const db = require('./database');

const { calcularBAC, calcularVasosMaximos } = require('./widmark');

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

app.post("/calcular", (req,res) =>
{
    const {peso, sexo, horas, bebida_id, cantidad = 1} = req.body;
    if(!peso||!sexo||!horas||!bebida_id)
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
    if(typeof horas != "number"|| Number.isNaN(horas)|| horas<0)
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
    const bac = calcularBAC(peso, sexo, horas, bebida.graduacion, bebida.volumen_ml, cantidad);
    const vasos = calcularVasosMaximos(peso, sexo, horas, bebida.graduacion, bebida.volumen_ml);
    const bajo_limite_legal = bac <= 0.50;
    res.json({
        bebida: bebida.nombre,
        bac: parseFloat(bac.toFixed(3)),
        vasos_maximos: vasos,
        bajo_limite_legal,
        limite_bolivia: 0.50
    });
});