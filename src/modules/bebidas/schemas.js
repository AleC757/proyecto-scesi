const { z } = require ('zod');

const BebidaCreate = z.object({
        nombre: z.string().min(1, "el nombre es requerido"),
        graduacion: z.number().positive("la graduación debe ser mayor a 0"),
        volumen_ml: z.number().positive("el volumen debe ser mayor a 0"),
}
);

const MezclaCreate = z.object({
    nombre: z.string().min(1, "el nombre es requerido"),
    ingredientes: z.array(z.object({
            graduacion: z.number().positive("cada ingrediente necesita graduacion válida"),
            volumen_ml: z.number().positive("cada ingrediente necesita volumen valido "),
    })).min(2, "una mezcla necesita al menos 2 ingredientes")
});

const BebidaPatch = z.object({
    nombre: z.string().min(1, "el nombre no puede estar vacío").optional(),
    graduacion: z.number().positive("la graduación debe ser mayor a 0").optional(),
    volumen_ml: z.number().positive("el volumen debe ser mayor a 0").optional(),
});

module.exports = {BebidaCreate, MezclaCreate, BebidaPatch};