const express = require('express');
const app = express();


const bebidas = [
    {
        id: 1,
        nombre: "Paceña",
        graduacion: 4.8
    },
    {
        id: 2,
        nombre: "Singani",
        graduacion: 40
    },
    {
        id: 3,
        nombre: "Fernet",
        graduacion: 39
    }
];
app.listen(3000,()=> {
    console.log('Servidor ejecuntadose en puerto 3000');
});

app.get('/',(req, res) =>{
    res.send('Hola mundo');
});

app.get('/bebidas',(req,res)=>
{
    res.json(bebidas);
})
app.get('/bebidas/:id',(req, res) =>
{
    const id = parseInt(req.params.id);
    const bebida = bebidas.find(b=>b.id === id);
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