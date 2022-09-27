const { mongooseToObject } = require('../ulti/mongoose');
const { checkLogin } = require('../ulti/checklogin');
const { checkHex } = require('../ulti/checkHex');
const { getComment } = require('../ulti/getComment');
const diemthamquan = require('../models/destination')
const comments = require('../models/comment')

class diemthamquanControllers {
    //GET /:slug
    async diemthamquanDetail(req, res, next) {
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
                res.render('diemthamquan/detail', {
                    destination: mongooseToObject(data),
                    images: mongooseToObject(data.images),
                    commentsData: comment.reverse(),
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
}
module.exports = new diemthamquanControllers;