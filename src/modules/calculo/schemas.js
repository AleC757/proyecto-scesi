const { z } = require('zod');

const CalculoCreate = z.object({
    peso: z.number().positive("El peso debe ser un número válido y mayor a 0"),
    sexo: z.enum(["M", "F"], { message: "Sexo debe ser M o F." }),
    comio_antes: z.enum(["SI", "NO"], { message: "La respuesta debe ser SI o NO" }),
    horasEvento: z.number().positive("Las horas deben ser un número válido y mayor a 0"),
    vasos_planificados: z.number().positive("Los vasos planificados deben ser un número válido y mayor a 0"),
    bebida_id: z.number({ message: "faltan datos" }),
});

const TiempoConducirCreate = z.object({
    bac_actual: z.number().min(0, "El BAC no puede ser negativo."),
});

module.exports = { CalculoCreate, TiempoConducirCreate };