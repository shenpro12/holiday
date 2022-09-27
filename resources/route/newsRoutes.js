const express = require('express');
const newsControllers = require('../controllers/newsControllers');
const route = express.Router();

route.get('/page-:pageNumber', newsControllers.index);
route.get('/:id', newsControllers.newsDetail)
route.get('/api/searchNews/:tittle', newsControllers.searchNews)


module.exports = route;