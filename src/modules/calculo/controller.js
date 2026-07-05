const { CalculoCreate, TiempoConducirCreate } = require('./schemas');

const parsed = CalculoCreate.safeParse(req.body);
if (!parsed.success) {
    return res.status(400).json({
        error: parsed.error.issues[0].message
     });
}
const resultado = await CalculoService.calcular(parsed.data);


const parsed = TiempoConducirCreate.safeParse(req.body);
if (!parsed.success) {
    return res.status(400).json({
         error: parsed.error.issues[0].message
         });
}
res.json(CalculoService.tiempoParaConducir(parsed.data.bac_actual));