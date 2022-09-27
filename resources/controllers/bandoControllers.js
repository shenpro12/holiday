const { checkLogin } = require('../ulti/checklogin');
const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose');
const { checkHex } = require('../ulti/checkHex');
const { getComment } = require('../ulti/getComment');
const hotel = require('../models/hotel')
const diemthamquan = require('../models/destination')
const eating_spots = require('../models/eating_spot')
const comments = require('../models/comment')
class siteControllers {
    //GET /
    async index(req, res, next) {
        let user = checkLogin(req.session)
        res.render('map/map', {
            user,
            layout: 'mapLayout'
        })
    }
    async gethotel(req, res, next) {
        const hotelDatas = await hotel.find({})
        res.json(hotelDatas)
    }
    async getdestination(req, res, next) {
        const destinationDatas = await diemthamquan.find({})
        res.json(destinationDatas)
    }
    async geteatingspot(req, res, next) {
            const eating_spotsDatas = await eating_spots.find({})
            res.json(eating_spotsDatas)
        }
        //
    async infomation(req, res, next) {
        req.session.beforeUrl = req.originalUrl
        if (req.query.id && checkHex(req.query.id)) {
            res.send('NOT FOUND!!!')
            return
        }
        let user = checkLogin(req.session)
        if (req.query.id && req.query.id.length == 24) {
            if (await diemthamquan.findOne({ _id: req.query.id })) {
                const data = await diemthamquan.findOne({ _id: req.query.id })
                const commentsData = await comments.find({ pertain: req.query.id })
                let comment = []
                comment = await getComment(commentsData, req.session.userid)
                res.render('map/markerDetail', {
                    data: mongooseToObject(data),
                    commentsData: comment.reverse(),
                    images: mongooseToObject(data.images),
                    user,
                    totalComment: '(' + (comment.length).toString() + ')'
                })
            } else if (await hotel.findOne({ _id: req.query.id })) {
                const data = await hotel.findOne({ _id: req.query.id })
                const commentsData = await comments.find({ pertain: req.query.id })
                let comment = []
                comment = await getComment(commentsData, req.session.userid)
                res.render('map/markerDetail', {
                    data: mongooseToObject(data),
                    commentsData: comment.reverse(),
                    images: mongooseToObject(data.images),
                    user,
                    totalComment: '(' + (comment.length).toString() + ')'
                })
            } else if (await eating_spots.findOne({ _id: req.query.id })) {
                const data = await eating_spots.findOne({ _id: req.query.id })
                const commentsData = await comments.find({ pertain: req.query.id })
                let comment = []
                comment = await getComment(commentsData, req.session.userid)
                res.render('map/markerDetail', {
                    data: mongooseToObject(data),
                    commentsData: comment.reverse(),
                    images: mongooseToObject(data.images),
                    user,
                    totalComment: '(' + (comment.length).toString() + ')'
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        } else {
            res.send('NOT FOUND!!!')
        }
    }
}
module.exports = new siteControllers;