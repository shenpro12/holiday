const { checkLogin } = require('../ulti/checklogin');
const { checkHex } = require('../ulti/checkHex');
const { getComment } = require('../ulti/getComment');
const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose');
const news = require('../models/news')
const comments = require('../models/comment')
class newsControllers {
    //GET /news/:id
    async newsDetail(req, res, next) {
            req.session.beforeUrl = req.originalUrl
            if (req.params.id && checkHex(req.params.id)) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.params.id.length == 24) {
                const data = await Promise.all([
                    news.find({}),
                    news.findOne({ _id: req.params.id })
                ])
                let new_news = []
                for (let i = data[0].length - 1; i >= (data[0].length - 1) - 2; i--) {
                    new_news.push((data[0])[i])
                }

                let user = checkLogin(req.session)
                    //
                const commentsData = await comments.find({ pertain: req.params.id })
                let comment = []
                comment = await getComment(commentsData, req.session.userid)
                    //
                res.render('tintuc/newsDetail', {
                    newsData: mongooseToObject(data[1]),
                    user,
                    new_news: multipleMongooseToObject(new_news),
                    commentsData: comment.reverse(),
                    totalComment: '(' + (comment.length).toString() + ')',
                })
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /news/page-:pageNumber
    async index(req, res, next) {
            req.session.beforeUrl = req.originalUrl
            let data = await news.find({})

            let new_news = []
            for (let i = data.length - 1; i >= (data.length - 1) - 2; i--) {
                new_news.push(data[i])
            }

            data = data.reverse()


            let maxItem = 3 //max item on page
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

            let user = checkLogin(req.session)
            res.render('tintuc/news', {
                items: multipleMongooseToObject(mainData),
                pageNext,
                pagePre,
                pagePreNumber: (parseInt(req.params.pageNumber) - 1).toString(),
                pageNextNumber: (parseInt(req.params.pageNumber) + 1).toString(),
                user,
                new_news: multipleMongooseToObject(new_news)
            })
        }
        //GET /news/api/searchNews/:id
    async searchNews(req, res, next) {
        const newsDatas = await news.find({})
        const resDatas = []
        newsDatas.map(item => {
            if ((item.tittle).toLowerCase().indexOf(req.params.tittle.toLowerCase()) != -1) {
                resDatas.push(item)
            }

        })
        res.json(resDatas)
    }
}
module.exports = new newsControllers;