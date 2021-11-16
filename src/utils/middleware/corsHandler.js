const { config } = require('./../../../config');
const cors = require('cors');

function corsHandler() {
    const configCors = {
        origin: config.corsOrigin,
    }
    if (config.dev) {
        return cors();
    }
    return cors(configCors);
}

module.exports = corsHandler;