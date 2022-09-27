const express = require('express');
const hotelControllers = require('../controllers/hotelControllers');
const route = express.Router();

route.get('/page-:pageNumber', hotelControllers.index);
route.get('/:name', hotelControllers.hotelDetail);
route.get('/api/search/:key', hotelControllers.search);


module.exports = route;