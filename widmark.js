function calcularBAC(peso, sexo, horas, graduacion, volumen_ml, cantidad = 1)
{
    let r;
    if( sexo==="M")
        {
            r= 0.68;
        }
    else
        {
             r= 0.55;
        }
    const gramos_alcohol = volumen_ml * (graduacion / 100) * 0.789 * cantidad;
    const bac_inicial = gramos_alcohol/(peso * r);
    const bac_final = bac_inicial - (0.015 * horas);
    return Math.max(0, bac_final);
}
function calcularVasosMaximos(peso, sexo, horas, graduacion, volumen_ml)
{
    let r;
    if( sexo==="M")
        {
            r= 0.68;
        }
    else
        {
             r= 0.55;
        }   
    
    const limite_legal = 0.50;
    const gramos_permitidos = (limite_legal + (0.015 * horas)) *peso * r ;
    const gramos_por_vaso = volumen_ml * (graduacion / 100) * 0.789;
    const vasos = Math.floor(gramos_permitidos / gramos_por_vaso);
    return Math.max(0, vasos);
}
module.exports = {calcularBAC, calcularVasosMaximos};