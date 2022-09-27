const express = require('express');
const bandoControllers = require('../controllers/bandoControllers');
const route = express.Router();

route.get('/', bandoControllers.index);
route.get('/api/gethotel', bandoControllers.gethotel);
route.get('/api/getdestination', bandoControllers.getdestination);
route.get('/api/geteatingspot', bandoControllers.geteatingspot);
route.get('/api/infomation', bandoControllers.infomation);



module.exports = route;