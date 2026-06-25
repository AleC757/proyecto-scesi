const express = require('express');
const app = express();
app.get('/',(req, res) =>{
    res.send('Hola mundo');
});
app.get('/bebidas',(req, res) =>
{
    res.json(
        [
            {
                nombre: "Paceña",
                grado_alcoholico: 4.8
            },
            {
                nombre: "Singani",
                grado_alcoholico: 40
            }
        ]
    );
}
);
app.listen(3000,()=> {
    console.log('Servidor ejecuntadose en puerto 3000');
});