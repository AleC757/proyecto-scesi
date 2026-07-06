require('./src/core/mapping_database');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/', require('./src/core/api'));

app.get('/', (req, res) => res.send('Hola mundo'));

app.listen(3000, () => console.log('Servidor ejecutándose en puerto 3000'));