const joi = require('@hapi/joi');

const dateIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const dateSchema = joi.date();
const dailyDataSchema = joi.object();
const greenhouseIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);


const createDateSchema = {
    date: dateSchema.required(),
    dailyData: dailyDataSchema.required(),
    greenhouse_id: greenhouseIdSchema.required()
};

const updateDateSchema = {
    date: dateSchema,
    dailyData: dailyDataSchema,
    greenhouse_id: greenhouseIdSchema
};

module.exports = {
    dateIdSchema,
    createDateSchema,
    updateDateSchema
};

