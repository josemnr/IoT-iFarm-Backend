const express = require("express");
const router = express.Router();

const authApi = require('./auth');
const seedApi = require('./seed');
const userApi = require('./user');
const calendarApi = require('./calendar');
const feedbackApi = require('./feedback');
const greenhouseApi = require('./greenhouse');


function iFarmApi(app) {
    authApi(app);
    userApi(app);
    seedApi(app);
    calendarApi(app);
    feedbackApi(app);
    greenhouseApi(app);
}

module.exports = iFarmApi;
