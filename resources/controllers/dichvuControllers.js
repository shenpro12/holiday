const { mongooseToObject, multipleMongooseToObject } = require('../ulti/mongoose');
const { checkLogin } = require('../ulti/checklogin');
const { checkHex } = require('../ulti/checkHex');
const { getComment } = require('../ulti/getComment');
const tours = require('../models/tour')
const comments = require('../models/comment');
const account = require('../models/account');
const booking = require('../models/booking');

class dichvuControllers {
    //GET /tour/:slug
    async tourDetail(req, res, next) {
            req.session.beforeUrl = req.originalUrl
            let user = checkLogin(req.session)
            let bookingHistory = await booking.findOne({ userid: req.session.userid, tourId: req.query.id })
            if (bookingHistory) {
                var bookingStatus = 'Bạn đã đặt mặt hàng này rồi! Đơn hàng đang được xử lý! Vui lòng chờ nhân viên của chúng tôi liên hệ qua Email bạn cung cấp(Chậm nhất là 60 phút từ khi bạn gửi đơn hàng)! Hệ thống sẽ không ghi nhận đơn đặt hàng này khi bạn cố tình đặt hàng lại!'
            }
            if (req.session.userid) {
                var userInfo = await account.findOne({ _id: req.session.userid })
            }
            if (req.query.id && checkHex(req.query.id)) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.query.id && req.query.id.length == 24) {
                if (await tours.findOne({ _id: req.query.id })) {
                    const data = await tours.findOne({ _id: req.query.id })
                    const commentsData = await comments.find({ pertain: req.query.id })
                    let comment = []
                    comment = await getComment(commentsData, req.session.userid)
                    res.render('dichvu/tourDetail', {
                        tour: mongooseToObject(data),
                        images: mongooseToObject(data.images),
                        commentsData: comment.reverse(),
                        totalComment: '(' + (comment.length).toString() + ')',
                        user,
                        userInfo: mongooseToObject(userInfo),
                        bookingStatus
                    })
                } else {
                    res.send('NOT FOUND!!!')
                }
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //GET /page-:pageNumber || /page-:pageNumber?filter
    async index(req, res, next) {
            req.session.beforeUrl = req.originalUrl
            if (req.query.filter) {
                var data = await tours.find({ price: { $lt: parseInt(req.query.filter) } })
            } else {
                var data = await tours.find({})
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
                if (req.query.filter) {
                    return '/?filter=' + req.query.filter
                }
                return ''
            }
            let user = checkLogin(req.session)
            res.render('dichvu/tour', {
                items: multipleMongooseToObject(mainData),
                pageNext,
                pagePre,
                pagePreNumber: (parseInt(req.params.pageNumber) - 1).toString() + getFilter(),
                pageNextNumber: (parseInt(req.params.pageNumber) + 1).toString() + getFilter(),
                catalogActive: req.query.filter,
                user
            })
        }
        //POST dichvu/datve/:id
    async booking(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (await booking.findOne({ userid: req.session.userid, tourId: req.params.id })) {
                if (req.session.beforeUrl) {
                    res.redirect(req.session.beforeUrl)
                    return
                } else {
                    res.redirect('/')
                    return
                }
            }
            if (user && req.body.Cname && req.body.email) {
                if (await tours.findOne({ _id: req.params.id })) {
                    let bookingInfo = new booking({
                        tourId: req.params.id,
                        userid: user.userid,
                        username: req.body.Cname,
                        email: req.body.email,
                        content: req.body.content,
                        tittle: req.body.tittle,
                        status: false
                    })
                    bookingInfo.save()
                }
            }
            if (req.session.beforeUrl) {
                res.redirect(req.session.beforeUrl)
            } else {
                res.redirect('/')
            }
        }
        //GET /dichvu/api/search/tour/:key
    async search(req, res, next) {
        const tourDatas = await tours.find({})
        const resDatas = []
        tourDatas.map(item => {
            if ((item.name).toLowerCase().indexOf(req.params.key.toLowerCase()) != -1) {
                resDatas.push(item)
            }

        })
        res.json(resDatas)
    }

}
module.exports = new dichvuControllers;