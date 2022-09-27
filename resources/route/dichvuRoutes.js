const express = require('express');
const dichvuControllers = require('../controllers/dichvuControllers');
const route = express.Router();

route.get('/tour/:name', dichvuControllers.tourDetail);
route.get('/api/search/tour/:key', dichvuControllers.search);
route.get('/page-:pageNumber', dichvuControllers.index);
route.post('/datve/:id', dichvuControllers.booking);


module.exports = route;