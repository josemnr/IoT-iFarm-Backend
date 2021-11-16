const express = require("express");
const router = express.Router();
const passport = require("passport");
require('./../utils/auth/strategies/jwt');
const UserController = require("../controllers/user");
const {
    userIdSchema,
    createUserSchema,
    updateUserSchema
} = require('./../utils/schemas/user');
const validationHandler = require('./../utils/middleware/validationHandler');
const scopesValidationHandler = require('./../utils/middleware/scopesValidationHandler');

function userApi(app) {
    app.use('/api/users', router);

    const userController = new UserController();

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:user']),
        validationHandler(createUserSchema),
        async function (req, res, next) {
            const { body: user } = req;
            try {
                const createdUserId = await userController.createUser({ user });
                res.status(201).json({
                    data: createdUserId,
                    message: 'user created'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:user']),
        async function (req, res, next) {
            try {
                const users = await userController.getUsers(req.query);
                res.status(200).json({
                    data: users,
                    message: 'users listed'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/:userId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:user']),
        validationHandler({ userId: userIdSchema }, 'params'),
        async function (req, res, next) {
            const { userId } = req.params;
            try {
                const user = await userController.getUser({ userId });
                res.status(200).json({
                    data: user,
                    message: 'user retrieved'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.put(
        '/:userId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:user']),
        validationHandler({ userId: userIdSchema }, 'params'),
        validationHandler(updateUserSchema),
        async function (req, res, next) {
            const { userId } = req.params;
            const { body: user } = req;
            try {
                const updatedUserId = await userController.updateUser({
                    userId,
                    user
                });
                res.status(200).json({
                    data: updatedUserId,
                    message: 'user updated'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.delete(
        '/:userId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:user']),
        validationHandler({ userId: userIdSchema }, 'params'),
        async function (req, res, next) {
            const { userId } = req.params;
            try {
                const deletedUserId = await userController.deleteUser({ userId });
                res.status(200).json({
                    data: deletedUserId,
                    message: 'user deleted'
                });
            } catch (err) {
                next(err);
            }
        }
    );
}

module.exports = userApi;