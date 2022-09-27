const express = require('express');
const diemanuongControllers = require('../controllers/diemanuongControllers');
const route = express.Router();

route.get('/:name', diemanuongControllers.diemanuongDetail);

module.exports = route;