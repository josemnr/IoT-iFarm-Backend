//Server Constants
const express = require('express');
const router = express.Router();
const { config } = require('./../../config');

//Constantes de autenticación
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Controladores
const UserController = require('./../controllers/user');
const ApiKeysController = require('./../controllers/apiKeys');

//Schemas
const { createUserSchema, createProviderUserSchema } = require('./../utils/schemas/user');
const validationHandler = require('./../utils/middleware/validationHandler');

//Auth strategy
require('./../utils/auth/strategies/basic');

function authApi(app) {
    app.use('/api/auth', router);
    
    const userController = new UserController();
    const apiKeysController = new ApiKeysController();

    router.post('/sign-in', async function (req, res, next) {
        passport.authenticate('basic', function (error, user) {
            try {
                if (error || !user) {
                    return next(boom.unauthorized());
                }

                req.login(user, { session: false }, async function (error) {
                    if (error) {
                        return next(error);
                    }
                    const { role } = user;
                    const apiKey = await apiKeysController.getApiKey({ scope: role });
                    if (!apiKey) {
                        return next(boom.unauthorized());
                    }
                    const { _id: id, email, name } = user;
                    const payload = {
                        sub: id,
                        email,
                        name,
                        scopes: apiKey.scopes
                    };
                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '30m'
                    });
                    return res.status(200).json({ token, user: { id, name, email } });
                });
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    });

    router.post(
        '/sign-up',
        validationHandler(createUserSchema),
        async function (req, res, next) {
            const { body: user } = req;
            try {
                const createdUserId = await userController.createUser({ user });
                res.status(201).json({
                    data: createdUserId,
                    message: 'user created'
                });
            } catch (error) {
                next(error);
            }
        }
    );

    router.post('/sign-provider', validationHandler(createProviderUserSchema), 
    async function(req, res, next){
        const {body} = req;
        const userController = new UserController();
        const apiKeysController = new ApiKeysController();
        console.log(body);
        const {apiKeyToken, ...user} = body;

        if(!apiKeyToken){
            next(boom.unauthorized('apiKey is required'));
        }

        console.log(apiKeyToken);
        try {
            console.log("this is user: " ,user);
            const queriedUser = await userController.getOrCreateUser(user);
            const { role } = queriedUser[0];
            const apiKey = await apiKeysController.getApiKey({ scope: role });

            console.log(queriedUser, apiKey);


            if(!apiKey){
                next(boom.unauthorized());
            }

            const{_id: id, name, email} = queriedUser[0];

            const payload = {
                sub: id, 
                name, 
                email,
                scopes: apiKey.scopes
            }

            const token = jwt.sign(payload, config.authJwtSecret, {
                expiresIn: '30m'
            });
            return res.status(200).json({token, user:{id, name, email}});
        } catch (error) {
            next(error)
        }
    })
}

module.exports = authApi