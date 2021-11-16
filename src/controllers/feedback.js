const feedbackModel = require("../models/feedback");

class FeedbackController {
    async createFeedback({ feedback }) {
        const createdFeedbackId = await feedbackModel.create(feedback);
        return createdFeedbackId;
    }

    async getFeedbacks(filters) {
        const feedbacks = await feedbackModel.getAll(filters);
        return feedbacks || [];
    };

    async getFeedback({ feedbackId }) {
        const feedback = await feedbackModel.get(feedbackId);
        return feedback || {};
    };

    async updateFeedback({ feedbackId, feedback } = {}) {
        const updatedFeedbackId = await feedbackModel.update(
            feedbackId,
            feedback
        );
        return updatedFeedbackId;
    }

    async deletefeedback({ feedbackId }) {
        const deletedFeedbackId = await feedbackModel.delete(feedbackId);
        return deletedFeedbackId;
    }
}

module.exports = FeedbackController;