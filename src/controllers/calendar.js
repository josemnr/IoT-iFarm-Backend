const calendarModel = require("../models/calendar");

class CalendarController {
    async createDate({ date }) {
        const createdDateId = await calendarModel.create(date);
        return createdDateId;
    }

    async getDates(filters) {
        const dates = await calendarModel.getAll(filters);
        return dates || [];
    };

    async getDate({ dateId }) {
        const date = await calendarModel.get(dateId);
        return date || {};
    };

    async updateDate({ dateId, date } = {}) {
        const updatedDateId = await calendarModel.update(
            dateId,
            date
        );
        return updatedDateId;
    }

    async deleteDate({ dateId }) {
        const deletedDateId = await calendarModel.delete(dateId);
        return deletedDateId;
    }
}

module.exports = CalendarController;