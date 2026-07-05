const BebidaService = require('./services');
const {BebidaCreate, MezclaCreate} = require('./schemas');
class BebidaController {
    static getAll(req,res)
    {
        res.json(BebidaService.getAll());
    }
    static getById(req,res)
    {
        const bebida = BebidaService.getById(parseInt(req.params.id));
        if(!bebida)
        {
            return res.status(404).json({
                error: 'bebida no encontrada'
            });
        }
        res.json(bebida);
    }
    static create(req,res)
    {
        const parsed = BebidaCreate.safeParse(req.body);
        if(!parsed.success)
        {
            return res.status(400).json({
                error: parsed.error.issues[0].message
            });
        }
        res.status(201).json(BebidaService.create(parsed.data));
    }
    static createMezcla(req,res)
    {
        const parsed = MezclaCreate.safeParse(req.body);
        if(!parsed.success)
        {
            return res.status(400).json({
                error: parsed.error.issues[0].message
            });
        }
        res.status(201).json(BebidaService.createMezcla(parsed.data));
    }
}
module.exports= BebidaController;