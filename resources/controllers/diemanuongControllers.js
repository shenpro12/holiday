const { mongooseToObject } = require('../ulti/mongoose');
const { checkLogin } = require('../ulti/checklogin');
const { checkHex } = require('../ulti/checkHex');
const { getComment } = require('../ulti/getComment');
const eating_spots = require('../models/eating_spot')
const comments = require('../models/comment')

class diemanuongControllers {
    //GET /:slug
    async diemanuongDetail(req, res, next) {
        req.session.beforeUrl = req.originalUrl
        if (req.query.id && checkHex(req.query.id)) {
            res.send('NOT FOUND!!!')
            return
        }

        let user = checkLogin(req.session)
        if (req.query.id && req.query.id.length == 24) {
            if (await eating_spots.findOne({ _id: req.query.id })) {
                const data = await eating_spots.findOne({ _id: req.query.id })
                const commentsData = await comments.find({ pertain: req.query.id })
                let comment = []
                comment = await getComment(commentsData, req.session.userid)
                res.render('diemanuong/detail', {
                    eating_spot: mongooseToObject(data),
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
}
module.exports = new diemanuongControllers;