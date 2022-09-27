const homeBanner = require('../models/homeBanner')
const destination = require('../models/destination')
const specialty_dish = require('../models/special_dish')
const tour = require('../models/tour')
const eating_spot = require('../models/eating_spot')
const { checkLogin } = require('../ulti/checklogin');
const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose');
class siteControllers {
    //GET /home
    async home(req, res, next) {
        req.session.beforeUrl = ''
        const data = await Promise.all([
            homeBanner.find({}),
            destination.find({}),
            specialty_dish.find({}),
            tour.find({}),
            eating_spot.find({}),
        ])
        let user = checkLogin(req.session)

        res.render('home', {
            banner: multipleMongooseToObject(data[0]),
            destinations: multipleMongooseToObject(data[1]),
            dishs: multipleMongooseToObject(data[2]),
            tours: multipleMongooseToObject(data[3]),
            eating_spot: multipleMongooseToObject(data[4]),
            user
        })
    }
}
module.exports = new siteControllers;