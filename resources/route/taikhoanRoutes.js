const express = require('express');
const taikhoanControllers = require('../controllers/taikhoanControllers');
const route = express.Router();

route.get('/prof/bindEmail', taikhoanControllers.bindEmail);
route.get('/prof/changeEmail', taikhoanControllers.changeEmail);
route.get('/dangnhap', taikhoanControllers.index);
route.get('/dangxuat', taikhoanControllers.logout);
route.get('/prof/:id', taikhoanControllers.prof);
route.get('/matkhau', taikhoanControllers.forgotPasswordPage);
route.post('/dangnhap', taikhoanControllers.checkAccount);
route.post('/dangky', taikhoanControllers.signup);
route.post('/prof/:id/update', taikhoanControllers.updateInfo);
route.post('/matkhau/', taikhoanControllers.checkUser);
route.post('/prof/changeEmail', taikhoanControllers.cEmail);
route.post('/prof/bindEmail', taikhoanControllers.bEmail);

module.exports = route;