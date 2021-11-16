const express = require("express");
const router = express.Router();

const authApi = require('./auth');

const greenhouseApi = require('./greenhouse');
const calendarApi = require('./calendar');
const seedApi = require('./seed');
const userApi = require('./user');


function iFarmApi(app) {
    authApi(app)
    
    greenhouseApi(app);
    calendarApi(app);
    userApi(app);
    seedApi(app);
}

module.exports = iFarmApi;
