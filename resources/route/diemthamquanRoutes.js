const express = require('express');
const diemthamquanControllers = require('../controllers/diemthamquanControllers');
const route = express.Router();

route.get('/:name', diemthamquanControllers.diemthamquanDetail);

module.exports = route;