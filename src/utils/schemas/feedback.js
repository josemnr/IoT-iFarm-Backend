const joi = require('@hapi/joi');

const feedbackIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const seedIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const UserNameSchema = joi.string().max(60);
const CommentSchema = joi.string().max(400);
const scoreSchema = joi.number().min(0).max(5);
const paramsSchema = joi.object();

const createFeedbackSchema = {
    user_name: UserNameSchema.required(),
    comment: CommentSchema.required(),
    score: scoreSchema.required(),
    seed_id: seedIdSchema.required(),
    params: paramsSchema.required(),
};

const updateFeedbackSchema = {
    user_name: UserNameSchema,
    comment: CommentSchema,
    score: scoreSchema,
    seed_id: seedIdSchema,
    params: paramsSchema,
};

module.exports = {
    feedbackIdSchema,
    createFeedbackSchema,
    updateFeedbackSchema
};