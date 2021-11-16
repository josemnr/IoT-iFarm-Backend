const express = require("express");
const router = express.Router();
const passport = require("passport");
require('./../utils/auth/strategies/jwt');
const GreenhouseController = require("../controllers/greenhouse");
const {
    greenhouseIdSchema,
    createGreenhouseSchema,
    updateGreenhouseSchema
} = require('./../utils/schemas/greenhouse');
const validationHandler = require('./../utils/middleware/validationHandler');
const scopesValidationHandler = require('./../utils/middleware/scopesValidationHandler');


function greenhouseApi(app) {
    app.use('/api/greenhouses', router);

    const greenhouseController = new GreenhouseController();

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:greenhouse']),
        validationHandler(createGreenhouseSchema),
        async function (req, res, next) {
            const { body: greenhouse } = req;
            try {
                const createdGreenhouseId = await greenhouseController.createGreenhouse({ greenhouse });
                res.status(201).json({
                    data: createdGreenhouseId,
                    message: 'greenhouse created'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/', 
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:greenhouse']),
        async function (req, res, next) {
            console.log(JSON.stringify(req.query));
            try {
                const greenhouses = await greenhouseController.getGreenhouses(req.query);
                res.status(200).json({
                    data: greenhouses,
                    message: 'greenhouses listed'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/:greenhouseId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:greenhouse']),
        validationHandler({ greenhouseId: greenhouseIdSchema }, 'params'),
        async function (req, res, next) {
            const { greenhouseId } = req.params;
            try {
                const greenhouse = await greenhouseController.getGreenhouse({ greenhouseId });
                res.status(200).json({
                    data: greenhouse,
                    message: 'greenhouse retrieved'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.put(
        '/:greenhouseId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:greenhouse']),
        validationHandler({ greenhouseId: greenhouseIdSchema }, 'params'),
        validationHandler(updateGreenhouseSchema),
        async function (req, res, next) {
            const { greenhouseId } = req.params;
            const { body: greenhouse } = req;
            try {
                const updatedGreenhouseId = await greenhouseController.updateGreenhouse({
                    greenhouseId,
                    greenhouse
                });
                res.status(200).json({
                    data: updatedGreenhouseId,
                    message: 'greenhouse updated'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.delete(
        '/:greenhouseId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:greenhouse']),
        validationHandler({ greenhouseId: greenhouseIdSchema }, 'params'),
        async function (req, res, next) {
            const { greenhouseId } = req.params;
            try {
                const deletedGreenhouseId = await greenhouseController.deleteGreenhouse({ greenhouseId });
                res.status(200).json({
                    data: deletedGreenhouseId,
                    message: 'greenhouse deleted'
                });
            } catch (err) {
                next(err);
            }
        }
    );
}

module.exports = greenhouseApi;