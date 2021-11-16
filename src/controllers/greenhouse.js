const greenhouseModel = require("../models/greenhouse");

class GreenhouseController {
    async createGreenhouse({ greenhouse }) {
        const createdGreenhouseId = await greenhouseModel.create(greenhouse);
        return createdGreenhouseId;
    }

    async getGreenhouses(filters) {
        const greenhouses = await greenhouseModel.getAll(filters);
        return greenhouses || [];
    };

    async getGreenhouse({ greenhouseId }) {
        const greenhouse = await greenhouseModel.get(greenhouseId);
        return greenhouse || {};
    };

    async updateGreenhouse({ greenhouseId, greenhouse } = {}) {
        const updatedGreenhouseId = await greenhouseModel.update(
            greenhouseId,
            greenhouse
        );
        return updatedGreenhouseId;
    }

    async deleteGreenhouse({ greenhouseId }) {
        const deletedGreenhouseId = await greenhouseModel.delete(greenhouseId);
        return deletedGreenhouseId;
    }
}

module.exports = GreenhouseController;