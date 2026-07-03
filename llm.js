const Groq = require('groq-sdk');
const client = new Groq(
    {
        apiKey: process.env.GROQ_API_KEY
    }
);
async function generarConsejo(datos)
{
    const { peso, sexo, comio_antes, horas_evento,
        bebida, vasos_planificados, max_vasos,
        ritmo_minutos, bac_final, plan_es_seguro }= datos;
    const sexo_texto = sexo === 'M' ? 'hombre' : ' mujer';
    const comida_texto = comio_antes === 'SI' ? 'comió antes' : 'no comió antes';

    const respuesta = await client.chat.completions.create(
        {
            model: 'llama-3.1-8b-instant',
            max_tokens: 150,
            messages:[{
                    role:'user',
                    content: `Eres un asesor de reducción de daños en Bolivia.
                      El usuario es un ${sexo_texto} de ${peso}kg que ${comida_texto}.
                      Planea tomar ${vasos_planificados} vasos de ${bebida} en ${horas_evento} horas.
                      El máximo seguro para no pasar el límite legal boliviano (0.50 g/L) es ${max_vasos} vasos.
                      Debería esperar ${ritmo_minutos} minutos entre cada vaso.
                      Su BAC estimado al terminar la noche será ${bac_final} g/L.
                      Su plan ${plan_es_seguro ? 'ES seguro' : 'NO ES seguro, excede el límite legal'}.
                      Da un consejo preventivo breve (máximo 2 oraciones), 
                      amigable y con referencia cultural boliviana si es posible.`
            }]
        }
    );
    return respuesta.choices[0].message.content;
}

module.exports = {generarConsejo};