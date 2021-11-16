const joi = require('@hapi/joi');

const seedIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const seedNameSchema = joi.string().max(20);
const seedTimeSchema = joi.number();
const seedLightSchema = joi.number();
const seedHumiditySchema = joi.number();
const seedTemperatureSchema = joi.number();
const seedImageSchema = joi.string();

const createSeedSchema = {
    name: seedNameSchema.required(),
    time: seedTimeSchema.required(),
    min_light: seedLightSchema.required(),
    max_light: seedLightSchema.required(),
    min_humidity: seedHumiditySchema.required(),
    max_humidity: seedHumiditySchema.required(),
    min_temperature: seedTemperatureSchema.required(),
    max_temperature: seedTemperatureSchema.required(),
    image: seedImageSchema
};

const updateSeedSchema = {
    name: seedNameSchema,
    time: seedTimeSchema,
    min_light: seedLightSchema,
    max_light: seedLightSchema,
    min_humidity: seedHumiditySchema,
    max_humidity: seedHumiditySchema,
    image: seedImageSchema
};

module.exports = {
    seedIdSchema,
    createSeedSchema,
    updateSeedSchema
};
