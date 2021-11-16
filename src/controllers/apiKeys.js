const apiKeysModel = require("../models/apiKeys");

class ApiKeysController {
    async getApiKey({ scope }) {
        const [apikey] = await apiKeysModel.getAll({scope});
        return apikey
    }

}

module.exports = ApiKeysController;