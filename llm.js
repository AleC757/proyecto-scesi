const Groq = require('groq-sdk');
const client = new Groq(
    {
        apiKey: process.env.GROQ_API_KEY
    }
);
async function generarConsejo(datos)
{
    const { peso, sexo, horas, bebida, cantidad, bac, vasos_maximos}= datos;
    const sexo_texto = sexo === 'M' ? 'hombre' : ' mujer';
    const bajo_limite = bac <= 0.50;
    const respuesta = await client.chat.completions.create(
        {
            model: 'llama-3.1-8b-instant',
            max_tokens: 150,
            messages:[{
                    role:'user',
                    content: `Eres un asistente de salud en Bolivia.
                    el usuario es un ${sexo_texto} de ${peso}kg.
                    Va a una fiesta de ${horas} horas tomando ${bebida}.
                    Planea tomar máximo ${vasos_maximos} vasos para mantenerse bajo el 
                    límite legal boliviano de 0.50 g/L.
                    ${bajo_limite
                        ? 'Está bajo el limite legal'
                        : 'ESTA SOBRE EL LÍMITE LEGAL, no puede conducir.'}
                    Da un consejo breve (máximo 2 oraciones, amigable, con alguna referencia 
                    cultural boliviana si es posible.`
            }]
        }
    );
    return respuesta.choices[0].message.content;
}

module.exports = {generarConsejo};