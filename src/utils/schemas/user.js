const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userEmailSchema = joi.string().email();
const userNameSchema = joi.string().max(60);
const userPasswordSchema = joi.string();
const userRoleSchema = joi.string();
const userGoogleIdSchema = joi.string();
const userProfilePicSchema = joi.string();
const supervisorIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const greenhousesIdSchema = joi.array();

const UserSchema = {
    email: userEmailSchema.required(),
    name: userNameSchema.required(),
    password: userPasswordSchema,
    role: userRoleSchema.required(),
    google_id: userGoogleIdSchema,
    profile_pic: userProfilePicSchema,
    supervisor_id: supervisorIdSchema,
    greenhouses_id: greenhousesIdSchema,
};


const createUserSchema = {
    ...UserSchema,
    role: joi.string()

};

const createProviderUserSchema = {
    ...UserSchema,
    apiKeyToken: joi.string().required()
};
const updateUserSchema = {
    email: userEmailSchema,
    name: userNameSchema,
    password: userPasswordSchema,
    role: userRoleSchema,
    google_id: userGoogleIdSchema,
    profile_pic: userProfilePicSchema,
    supervisor_id: supervisorIdSchema,
    greenhouses_id: greenhousesIdSchema,
};

module.exports = {
    userIdSchema,
    createUserSchema,
    updateUserSchema,
    createProviderUserSchema
};

