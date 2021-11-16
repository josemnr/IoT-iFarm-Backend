const express = require("express");
const router = express.Router();
const passport = require("passport");
require('./../utils/auth/strategies/jwt');
const CalendarController = require("../controllers/calendar");
const {
    dateIdSchema,
    createDateSchema,
    updateDateSchema
} = require('./../utils/schemas/calendar');
const validationHandler = require('./../utils/middleware/validationHandler');
const scopesValidationHandler = require('./../utils/middleware/scopesValidationHandler');

function calendarApi(app) {
    app.use('/api/calendar', router);

    const calendarController = new CalendarController();

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:calendar']),
        validationHandler(createDateSchema),
        async function (req, res, next) {
            const { body: date } = req;
            try {
                const createdDateId = await calendarController.createDate({ date });
                res.status(201).json({
                    data: createdDateId,
                    message: 'date created'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:calendar']),
        async function (req, res, next) {
            try {
                const dates = await calendarController.getDates(req.query);
                res.status(200).json({
                    data: dates,
                    message: 'dates listed'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/:dateId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:calendar']),
        validationHandler({ dateId: dateIdSchema }, 'params'),
        async function (req, res, next) {
            const { dateId } = req.params;
            try {
                const date = await calendarController.getDate({ dateId });
                res.status(200).json({
                    data: date,
                    message: 'date retrieved'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.put(
        '/:dateId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:calendar']),
        validationHandler({ dateId: dateIdSchema }, 'params'),
        validationHandler(updateDateSchema),
        async function (req, res, next) {
            const { dateId } = req.params;
            const { body: date } = req;
            try {
                const updatedDateId = await calendarController.updateDate({
                    dateId,
                    date
                });
                res.status(200).json({
                    data: updatedDateId,
                    message: 'date updated'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.delete(
        '/:dateId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:calendar']),
        validationHandler({ dateId: dateIdSchema }, 'params'),
        async function (req, res, next) {
            const { dateId } = req.params;
            try {
                const deletedDateId = await calendarController.deleteDate({ dateId });
                res.status(200).json({
                    data: deletedDateId,
                    message: 'date deleted'
                });
            } catch (err) {
                next(err);
            }
        }
    );
}

module.exports = calendarApi;