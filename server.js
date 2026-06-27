const express = require('express');
const app = express();
app.use(express.json());

const db = require('./database');

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
        )
    }
    res.json(bebida);
}
);

app.post("/calcular", (req,res) =>
{
    const {peso, sexo, horas, bebida} = req.body;
    if(!peso||!sexo||!horas||!bebida)
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
    console.log(peso);
    console.log(sexo);
    console.log(horas);
    console.log(bebida);
    res.json(
        {
            "mensaje": "Datos recibidos"
        }
    );
});