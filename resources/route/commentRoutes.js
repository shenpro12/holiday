const express = require('express');
const commentsControllers = require('../controllers/commentControllers');
const route = express.Router();

route.post('/:id', commentsControllers.addComment);
route.get('/:id/delete', commentsControllers.deleteComment);
route.get('/:id/report', commentsControllers.reportComment);



module.exports = route;