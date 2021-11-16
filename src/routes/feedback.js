const express = require("express");
const router = express.Router();
const passport = require("passport");
require('./../utils/auth/strategies/jwt');
const FeedbackController = require("../controllers/feedback");
const {
    feedbackIdSchema,
    createFeedbackSchema,
    updateFeedbackSchema
} = require('./../utils/schemas/feedback');
const validationHandler = require('./../utils/middleware/validationHandler');
const scopesValidationHandler = require('./../utils/middleware/scopesValidationHandler');


function feedbackApi(app) {
    app.use('/api/feedback', router);

    const feedbackController = new FeedbackController();

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:feedback']),
        validationHandler(createFeedbackSchema),
        async function (req, res, next) {
            const { body: feedback } = req;
            try {
                const createdFeedbackId = await feedbackController.createFeedback({ feedback });
                res.status(201).json({
                    data: createdFeedbackId,
                    message: 'feedback created'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/', 
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:feedback']),
        async function (req, res, next) {
            console.log(JSON.stringify(req.query));
            try {
                const feedbacks = await feedbackController.getFeedbacks(req.query);
                res.status(200).json({
                    data: feedbacks,
                    message: 'feedbacks listed'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get(
        '/:feedbackId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:feedback']),
        validationHandler({ feedbackId: feedbackIdSchema }, 'params'),
        async function (req, res, next) {
            const { feedbackId } = req.params;
            try {
                const feedback = await feedbackController.getFeedback({ feedbackId });
                res.status(200).json({
                    data: feedback,
                    message: 'feedback retrieved'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.put(
        '/:feedbackId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:feedback']),
        validationHandler({ feedbackId: feedbackIdSchema }, 'params'),
        validationHandler(updateFeedbackSchema),
        async function (req, res, next) {
            const { feedbackId } = req.params;
            const { body: feedback } = req;
            try {
                const updatedFeedbackId = await feedbackController.updateFeedback({
                    feedbackId,
                    feedback
                });
                res.status(200).json({
                    data: updatedFeedbackId,
                    message: 'feedback updated'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.delete(
        '/:feedbackId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:feedback']),
        validationHandler({ feedbackId: feedbackIdSchema }, 'params'),
        async function (req, res, next) {
            const { feedbackId } = req.params;
            try {
                const deletedFeedbackId = await feedbackController.deleteFeedback({ feedbackId });
                res.status(200).json({
                    data: deletedFeedbackId,
                    message: 'feedback deleted'
                });
            } catch (err) {
                next(err);
            }
        }
    );
}

module.exports = feedbackApi;