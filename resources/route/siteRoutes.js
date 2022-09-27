const express = require('express');
const siteControllers = require('../controllers/siteControllers');
const route = express.Router();

route.get('/', siteControllers.home);

module.exports = route;