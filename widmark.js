function calcularBAC(peso, sexo, graduacion, volumen_ml , comio_antes)
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
    let m;
    if(comio_antes==="SI")
    {
        m=0.70;
    }
    else{
        m = 1;
    }
    const gramos_alcohol = volumen_ml * (graduacion / 100) * 0.789 ;
    const bacxvaso = gramos_alcohol* m /(peso * r);
    return(bacxvaso);
}
function TiempoEntreTrago(bacxvaso)
{
    const tiempoHoras = bacxvaso/0.15;
    const tiempominutos = Math.round(tiempoHoras*60);
    return (tiempominutos);
}
function vasos_maximos(bacxvaso)
{
    const vasos = Math.floor(0.50/bacxvaso )
    return (vasos);
}
function SobriedadEnCuanto(vasosPlanificados, bacxvaso, horasEvento) {
    const bacTeoricoTotal = vasosPlanificados * bacxvaso;

    const alcoholEliminadoEnFiesta = horasEvento * 0.15;

    const bacFinalEvento = bacTeoricoTotal - alcoholEliminadoEnFiesta;
    
    let horasExtraNecesarias = 0;
    
    if (bacFinalEvento > 0) {
        horasExtraNecesarias = bacFinalEvento / 0.15;
    }
    
    const tiempoTotalSobrioHoras = horasEvento + horasExtraNecesarias;
    
    return {
        bacFinal: bacFinalEvento > 0 ? Number(bacFinalEvento.toFixed(3)) : 0,
        horasTotalesParaCero: Number(tiempoTotalSobrioHoras.toFixed(2))
    };
}
module.exports = {calcularBAC,TiempoEntreTrago, vasos_maximos, SobriedadEnCuanto };