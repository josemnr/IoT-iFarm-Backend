const joi = require('@hapi/joi');

const greenhouseIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const seedIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const greenhouseNameSchema = joi.string().max(60);
const deviceIdSchema = joi.string().max(60);
const greenhouseLightSchema = joi.number();
const greenhouseHumiditySchema = joi.number();
const greenhouseTemperatureSchema = joi.number();
const greenhouseDateSchema = joi.string();

const createGreenhouseSchema = {
    name: greenhouseNameSchema.required(),
    light: greenhouseLightSchema.required(),
    humidity: greenhouseHumiditySchema.required(),
    temperature: greenhouseTemperatureSchema.required(),
    start_at: greenhouseDateSchema.required(),
    seed_id: seedIdSchema.required(),
    device_id: deviceIdSchema.required()
};

const updateGreenhouseSchema = {
    name: greenhouseNameSchema,
    light: greenhouseLightSchema,
    humidity: greenhouseHumiditySchema,
    temperature: greenhouseTemperatureSchema,
    start_at: greenhouseDateSchema,
    seed_id: seedIdSchema,
    device_id: deviceIdSchema
};

module.exports = {
    greenhouseIdSchema,
    createGreenhouseSchema,
    updateGreenhouseSchema
};