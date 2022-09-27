const { mongooseToObject, multipleMongooseToObject } = require('../ulti/mongoose');
const { checkLogin } = require('../ulti/checklogin');
const { checkHex } = require('../ulti/checkHex');
const { getComment } = require('../ulti/getComment');
const hotel = require('../models/hotel')
const comments = require('../models/comment')

class hotelControllers {
    //GET /:slug
    async hotelDetail(req, res, next) {
        req.session.beforeUrl = req.originalUrl
        let user = checkLogin(req.session)
        if (req.query.id && checkHex(req.query.id)) {
            res.send('NOT FOUND!!!')
            return
        }
        if (req.query.id && req.query.id.length == 24) {
            if (await hotel.findOne({ _id: req.query.id })) {
                const data = await hotel.findOne({ _id: req.query.id })
                const commentsData = await comments.find({ pertain: req.query.id })
                let comment = []
                comment = await getComment(commentsData, req.session.userid)
                res.render('hotel/hotelDetail', {
                    hotel: mongooseToObject(data),
                    commentsData: comment.reverse(),
                    images: mongooseToObject(data.images),
                    totalComment: '(' + (comment.length).toString() + ')',
                    user
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        } else {
            res.send('NOT FOUND!!!')
        }

    }
    async index(req, res, next) {
            req.session.beforeUrl = req.originalUrl
            if (req.query.type) {
                var data = await hotel.find({ type: req.query.type })
            } else {
                var data = await hotel.find({})
            }
            let maxItem = 6 //max item on page
            if (parseInt(req.params.pageNumber) > Math.round((data.length / maxItem) + 0.5) || parseInt(req.params.pageNumber) <= 0) {
                res.send('NOT FOUND!!!')
            } // show when no have page

            let pageEnd = req.params.pageNumber * maxItem - 1
            let pageStart = (req.params.pageNumber * maxItem) - maxItem
            let mainData = []
            let pageNext = true
            let pagePre = true
            for (let i = pageStart; i <= pageEnd; i++) {
                if (data[i]) {
                    mainData.push(data[i])
                    if (i == data.length - 1) {
                        pageNext = false
                    }
                } else {
                    pageNext = false
                    break
                }
            }
            if (parseInt(req.params.pageNumber) == 1) {
                pagePre = false
            }

            function getFilter() {
                if (req.query.type) {
                    return '/?type=' + req.query.type
                }
                return ''
            }
            let catalogActive
            if (req.query.type == 'hotel') {
                catalogActive = 3
            } else if (req.query.type == 'hostel') {
                catalogActive = 2
            } else if (req.query.type == 'homestay') {
                catalogActive = 1
            }
            let user = checkLogin(req.session)
            res.render('hotel/hotel', {
                items: multipleMongooseToObject(mainData),
                pageNext,
                pagePre,
                pagePreNumber: (parseInt(req.params.pageNumber) - 1).toString() + getFilter(),
                pageNextNumber: (parseInt(req.params.pageNumber) + 1).toString() + getFilter(),
                catalogActive: catalogActive,
                user
            })

        }
        //GET /hotel/api/search/:key
    async search(req, res, next) {
        const hotelDatas = await hotel.find({})
        const resDatas = []
        hotelDatas.map(item => {
            if ((item.name).toLowerCase().indexOf(req.params.key.toLowerCase()) != -1) {
                resDatas.push(item)
            }

        })
        res.json(resDatas)
    }
}
module.exports = new hotelControllers;