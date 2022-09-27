const { checkLogin } = require('../ulti/checklogin');
const { checkHex } = require('../ulti/checkHex');
const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose');
const XLSX = require('xlsx')
const bcrypt = require('bcrypt');
const account = require('../models/account')
const booking = require('../models/booking')
const destination = require('../models/destination')
const eating_spot = require('../models/eating_spot')
const homebanner = require('../models/homeBanner')
const hotel = require('../models/hotel')
const reportComment = require('../models/reportComment')
const special_dish = require('../models/special_dish')
const tour = require('../models/tour')
const comment = require('../models/comment')
const rep_comment = require('../models/rep_comment')
const hotelService = require('../models/hotelService')
const news = require('../models/news')
class quantriControllers {
    //GET /quantri
    async home(req, res, next) {
            let user = checkLogin(req.session)
            req.session.beforeUrl = req.originalUrl
            const data = await Promise.all([
                account.find({ admin: false }),
                booking.find({}),
                destination.find({}),
                eating_spot.find({}),
                homebanner.find({}),
                hotel.find({}),
                reportComment.find({}),
                special_dish.find({}),
                tour.find({}),
                news.find({})
            ])
            let rpComment = []
            for (let i = 0; i < data[6].length; i++) {
                if (await comment.findOne({ _id: (data[6])[i].commentId })) {
                    let dataComment = await comment.findOne({ _id: (data[6])[i].commentId })
                    rpComment.push({
                        commentId: dataComment._id,
                        rpCommentId: (data[6])[i]._id,
                        content: dataComment.content
                    })
                }
                if (await rep_comment.findOne({ _id: (data[6])[i].commentId })) {
                    let dataComment = await rep_comment.findOne({ _id: (data[6])[i].commentId })
                    rpComment.push({
                        commentId: dataComment._id,
                        rpCommentId: (data[6])[i]._id,
                        content: dataComment.content
                    })
                }
            }
            let bookingDatas = []
            for (let i = 0; i < data[1].length; i++) {
                let tourname = await tour.findOne({ _id: (data[1])[i].tourId })
                bookingDatas.push({
                    tourname: tourname.name,
                    username: (data[1])[i].username,
                    email: (data[1])[i].email,
                    tittle: (data[1])[i].tittle,
                    content: (data[1])[i].content
                })
            }
            if (req.session.admin) {
                res.render('admin/quantri', {
                    account: multipleMongooseToObject(data[0]),
                    booking: bookingDatas,
                    destination: multipleMongooseToObject(data[2]),
                    eating_spot: multipleMongooseToObject(data[3]),
                    homebanner: multipleMongooseToObject(data[4]),
                    hotel: multipleMongooseToObject(data[5]),
                    reportComment: rpComment,
                    special_dish: multipleMongooseToObject(data[7]),
                    tour: multipleMongooseToObject(data[8]),
                    news: multipleMongooseToObject(data[9]),
                    user,
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //GET /quantri/deleteAccount/:id
    async deleteAccount(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await account.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/resetPasswordAccount/:id
    async resetPasswordAccount(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                const pass = '1'
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(pass, salt)
                let user = await account.findOne({ _id: req.params.id })
                user.password = hash
                await account.updateOne({ _id: req.params.id }, user)
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/api/findAccount/:id
    async findAccount(req, res, next) {
            const accountDatas = await account.find({ admin: false })
            const resDatas = []
            accountDatas.map(item => {
                if ((item.username).toLowerCase().indexOf(req.params.name.toLowerCase()) != -1) {
                    resDatas.push(item)
                }

            })
            if (req.session.admin) {
                res.json(resDatas)
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/api/findDestination/:name
    async findDestination(req, res, next) {
            const destinationDatas = await destination.find({})
            const resDatas = []
            destinationDatas.map(item => {
                if ((item.name).toLowerCase().indexOf(req.params.name.toLowerCase()) != -1) {
                    resDatas.push(item)
                }

            })
            res.json(resDatas)
        }
        //GET /quantri/deleteDestination/:id
    async deleteDestination(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await destination.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/addDestination/
    async addDestination(req, res, next) {
            let user = checkLogin(req.session)
            if (req.session.admin) {
                res.render('admin/addDestination', {
                    user
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/addDestination/
    async addDestinationForm(req, res, next) {
            if (req.body.name && req.body.description && req.body.location && req.body.price && req.body.lat && req.body.long && req.body.thumb_url && req.session.admin) {
                let imageDatas = req.body.images
                let imageArr = []
                if (req.body.images && (typeof req.body.images) == 'object') {
                    for (let i = 0; i < imageDatas.length; i++) {
                        imageArr.push({
                            thumb_url: imageDatas[i]
                        })
                    }
                } else if (req.body.images && (typeof req.body.images) == 'string') {
                    imageArr.push({
                        thumb_url: req.body.images
                    })
                }

                const destinationData = new destination({
                    name: req.body.name,
                    description: req.body.description,
                    location: req.body.location,
                    price: req.body.price,
                    lat: req.body.lat,
                    long: req.body.long,
                    thumb_url: req.body.thumb_url,
                    images: imageArr
                })
                destinationData.save()
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/updateDestination/:id
    async updateDestination(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                let destinationData = await destination.findOne({ _id: req.params.id })
                res.render('admin/updateDestination', {
                    user,
                    destinationData: mongooseToObject(destinationData)
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/updateDestination/:id
    async updateDestinationForm(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }

            let destinationData = req.body
            let imageArr = []
            if (req.body.images && (typeof req.body.images) == 'object') {
                for (let i = 0; i < req.body.images.length; i++) {
                    imageArr.push({
                        thumb_url: req.body.images[i]
                    })
                }
            } else if (req.body.images && (typeof req.body.images) == 'string') {
                imageArr.push({
                    thumb_url: req.body.images
                })
            }
            destinationData.images = imageArr

            if (req.session.admin && req.params.id && req.body.name && req.body.description && req.body.location && req.body.price && req.body.lat && req.body.long && req.body.thumb_url) {
                await destination.updateOne({ _id: req.params.id }, destinationData)
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/deleteReportComment/:id
    async deleteReportComment(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                await reportComment.deleteOne({ commentId: req.params.id })
                await comment.deleteOne({ _id: req.params.id })
                await rep_comment.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/deleteAllReportComment/
    async deleteAllReportComment(req, res, next) {
            if (req.session.admin) {
                const rpCommentDatas = await reportComment.find({})
                let rpId = []
                rpCommentDatas.map(item => {
                    rpId.push(item.commentId)
                })
                for (let i = 0; i < rpId.length; i++) {
                    await reportComment.deleteOne({ commentId: rpId[i] })
                    await comment.deleteOne({ _id: rpId[i] })
                    await rep_comment.deleteOne({ _id: rpId[i] })
                }
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/addHomeBanner/
    addHomeBanner(req, res, next) {
            let user = checkLogin(req.session)
            if (req.session.admin) {
                res.render('admin/addHomeBanner', {
                    user
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/addHomeBanner/
    addHomeBannerForm(req, res, next) {
            if (req.body.name && req.body.description_down && req.body.description_up && req.body.id && req.body.thumb_url && req.session.admin) {
                const homeBannerData = new homebanner({
                    name: req.body.name,
                    description_up: req.body.description_up,
                    description_down: req.body.description_down,
                    id: req.body.id,
                    thumb_url: req.body.thumb_url
                })
                homeBannerData.save()
                console.log('save homebanner')
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/deleteHomeBanner/:id
    async deleteHomeBanner(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await homebanner.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/updateHomeBanner/:id
    async updateHomeBanner(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                let homeBannerData = await homebanner.findOne({ _id: req.params.id })
                res.render('admin/updateHomeBanner', {
                    user,
                    homeBannerData: mongooseToObject(homeBannerData)
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/updateHomeBanner/:id
    async updateHomeBannerForm(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id && req.body.name && req.body.description_up && req.body.escription_down && req.body.thumb_url) {
                await homebanner.updateOne({ _id: req.params.id }, req.body)
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/api/findEatingSpot/:name
    async findEatingSpot(req, res, next) {
            const eatingSpottDatas = await eating_spot.find({})
            const resDatas = []
            eatingSpottDatas.map(item => {
                if ((item.name).toLowerCase().indexOf(req.params.name.toLowerCase()) != -1) {
                    resDatas.push(item)
                }

            })
            res.json(resDatas)
        }
        //GET /quantri/deleteEatingSpot/:id
    async deleteEatingSpot(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await eating_spot.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/addEatingSpot/
    async addEatingSpot(req, res, next) {
            let user = checkLogin(req.session)
            if (req.session.admin) {
                res.render('admin/addEatingSpot', {
                    user
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/addEatingSpot/
    addEatingSpotForm(req, res, next) {
            if (req.body.name && req.body.phone && req.body.open && req.body.location && req.body.description && req.body.long && req.body.lat && req.body.thumb_url && req.session.admin) {
                let imageDatas = req.body.images
                let imageArr = []
                if (req.body.images && (typeof req.body.images) == 'object') {
                    for (let i = 0; i < imageDatas.length; i++) {
                        imageArr.push({
                            thumb_url: imageDatas[i]
                        })
                    }
                } else if (req.body.images && (typeof req.body.images) == 'string') {
                    imageArr.push({
                        thumb_url: req.body.images
                    })
                }

                const eatingSpotData = new eating_spot({
                    name: req.body.name,
                    phone: req.body.phone,
                    open: req.body.open,
                    location: req.body.location,
                    description: req.body.description,
                    lat: req.body.lat,
                    long: req.body.long,
                    thumb_url: req.body.thumb_url,
                    images: imageArr
                })
                eatingSpotData.save()
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/updateEatingSpot/:id
    async updateEatingSpot(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                let eatingSpotData = await eating_spot.findOne({ _id: req.params.id })
                res.render('admin/updateEatingSpot', {
                    user,
                    eatingSpotData: mongooseToObject(eatingSpotData)
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/updateEatingSpot/:id
    async updateEatingSpotForm(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            let eatingSpotData = req.body
            let imageArr = []
            if (req.body.images && (typeof req.body.images) == 'object') {
                for (let i = 0; i < req.body.images.length; i++) {
                    imageArr.push({
                        thumb_url: req.body.images[i]
                    })
                }
            } else if (req.body.images && (typeof req.body.images) == 'string') {
                imageArr.push({
                    thumb_url: req.body.images
                })
            }
            eatingSpotData.images = imageArr
            if (req.session.admin && req.body.name && req.body.phone && req.body.open && req.body.location && req.body.description && req.body.long && req.body.lat && req.body.thumb_url) {
                await eating_spot.updateOne({ _id: req.params.id }, eatingSpotData)
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/addspecialDish/
    addspecialDish(req, res, next) {
        let user = checkLogin(req.session)
        if (req.session.admin) {
            res.render('admin/addSpecialDish', {
                user
            })
        } else {
            res.send('NOT FOUND!!!')
        }
    }
    addspecialDishForm(req, res, next) {
            if (req.body.name && req.body.thumb_url && req.session.admin) {
                const specialDishData = new special_dish({
                    name: req.body.name,
                    thumb_url: req.body.thumb_url
                })
                specialDishData.save()
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/deletespecialDish/:id
    async deletespecialDish(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await special_dish.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/updatespecialDish/:id
    async updatespecialDish(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                let specialDishData = await special_dish.findOne({ _id: req.params.id })
                res.render('admin/updateSpecialDish', {
                    user,
                    specialDishData: mongooseToObject(specialDishData)
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/updatespecialDish/:id
    async updatespecialDishForm(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.body.name && req.body.thumb_url) {
                await special_dish.updateOne({ _id: req.params.id }, req.body)
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/api/findDestination/:name
    async findHotel(req, res, next) {
            const hotelDatas = await hotel.find({})
            const resDatas = []
            hotelDatas.map(item => {
                if ((item.name).toLowerCase().indexOf(req.params.name.toLowerCase()) != -1) {
                    resDatas.push(item)
                }

            })
            res.json(resDatas)
        }
        //GET /quantri/addHotel/
    addHotel(req, res, next) {
            let user = checkLogin(req.session)
            if (req.session.admin) {
                res.render('admin/addHotel', {
                    user
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST /quantri/addHotel
    async addHotelForm(req, res, next) {
            if (req.body.type && req.body.name && req.body.location && req.body.description && req.body.lat && req.body.long && req.body.thumb_url && req.session.admin) {
                let imageDatas = req.body.images
                let imageArr = []
                if (req.body.images && (typeof req.body.images) == 'object') {
                    for (let i = 0; i < imageDatas.length; i++) {
                        imageArr.push({
                            thumb_url: imageDatas[i]
                        })
                    }
                } else if (req.body.images && (typeof req.body.images) == 'string') {
                    imageArr.push({
                        thumb_url: req.body.images
                    })
                }
                //
                let serviceDatas = req.body.service
                let serviceArr = []
                if (req.body.service && (typeof req.body.service) == 'object') {
                    for (let i = 0; i < serviceDatas.length; i++) {
                        let service = await hotelService.findOne({ name: serviceDatas[i] })
                        serviceArr.push({
                            name: service.name,
                            thumb_url: service.thumb_url
                        })
                    }
                } else if (req.body.service && (typeof req.body.service) == 'string') {
                    let service = await hotelService.findOne({ name: req.body.service })
                    serviceArr.push({
                        name: service.name,
                        thumb_url: service.thumb_url
                    })
                }
                const hotelData = new hotel({
                    name: req.body.name,
                    location: req.body.location,
                    description: req.body.description,
                    lat: req.body.lat,
                    long: req.body.long,
                    thumb_url: req.body.thumb_url,
                    type: req.body.type,
                    images: imageArr,
                    service: serviceArr
                })
                hotelData.save()
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/deleteHotel/:id
    async deleteHotel(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await hotel.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET quantri/updateHotel/:id
    async updateHotel(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                let hotelData = await hotel.findOne({ _id: req.params.id })
                res.render('admin/updateHotel', {
                    user,
                    hotelData: mongooseToObject(hotelData)
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //GET quantri/updateHotel/api/service/:id
    async getService(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            const hotelDatas = await hotel.findOne({ _id: req.params.id })
            const serviceDatas = hotelDatas.service
            res.json(serviceDatas)

        }
        //POST quantri/updateHotel/:id
    async updateHotelForm(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            let hotelData = req.body
            let imageArr = []
            if (req.body.images && (typeof req.body.images) == 'object') {
                for (let i = 0; i < req.body.images.length; i++) {
                    imageArr.push({
                        thumb_url: req.body.images[i]
                    })
                }
            } else if (req.body.images && (typeof req.body.images) == 'string') {
                imageArr.push({
                    thumb_url: req.body.images
                })
            }
            hotelData.images = imageArr
                //
            let serviceArr = []
            if (req.body.service && (typeof req.body.service) == 'object') {
                for (let i = 0; i < req.body.service.length; i++) {
                    let service = await hotelService.findOne({ name: req.body.service[i] })
                    serviceArr.push({
                        name: service.name,
                        thumb_url: service.thumb_url
                    })
                }
            } else if (req.body.service && (typeof req.body.service) == 'string') {
                let service = await hotelService.findOne({ name: req.body.service })
                serviceArr.push({
                    name: service.name,
                    thumb_url: service.thumb_url
                })
            }
            hotelData.service = serviceArr
                //
            if (req.session.admin && req.body.name && req.body.location && req.body.description && req.body.lat && req.body.long && req.body.thumb_url && req.body.type) {
                await hotel.updateOne({ _id: req.params.id }, hotelData)
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /quantri/api/findTour/:name
    async findTour(req, res, next) {
            const tourDatas = await tour.find({})
            const resDatas = []
            tourDatas.map(item => {
                if ((item.name).toLowerCase().indexOf(req.params.name.toLowerCase()) != -1) {
                    resDatas.push(item)
                }

            })
            res.json(resDatas)
        }
        //GET quantri/addTour
    addTour(req, res, next) {
            let user = checkLogin(req.session)
            if (req.session.admin) {
                res.render('admin/addTour', {
                    user
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST quantri/addTour
    async addTourForm(req, res, next) {
            if (req.body.name && req.body.description && req.body.price && req.body.location && req.body.day && req.body.thumb_url && req.session.admin) {
                let imageDatas = req.body.images
                let imageArr = []
                if (req.body.images && (typeof req.body.images) == 'object') {
                    for (let i = 0; i < imageDatas.length; i++) {
                        imageArr.push({
                            thumb_url: imageDatas[i]
                        })
                    }
                } else if (req.body.images && (typeof req.body.images) == 'string') {
                    imageArr.push({
                        thumb_url: req.body.images
                    })
                }
                console.log(req.body)
                const tourData = new tour({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    startlocation: {
                        location: req.body.location,
                        days: parseInt(req.body.day)
                    },
                    thumb_url: req.body.thumb_url,
                    images: imageArr
                })
                tourData.save()
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET quantri/deleteTour/:id
    async deleteTour(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await tour.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET quantri/updateTour/:id
    async updateTour(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                let tourData = await tour.findOne({ _id: req.params.id })
                res.render('admin/updateTour', {
                    user,
                    tourData: mongooseToObject(tourData)
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST quantri/updateTour/:id
    async updateTourForm(req, res, next) {
        if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
            res.send('NOT FOUND!!!')
            return
        }
        let tourData = req.body
        let imageArr = []
        if (req.body.images && (typeof req.body.images) == 'object') {
            for (let i = 0; i < req.body.images.length; i++) {
                imageArr.push({
                    thumb_url: req.body.images[i]
                })
            }
        } else if (req.body.images && (typeof req.body.images) == 'string') {
            imageArr.push({
                thumb_url: req.body.images
            })
        }
        tourData.images = imageArr
        if (req.session.admin && req.body.name && req.body.description && req.body.price && req.body.location && req.body.day && req.body.thumb_url) {
            await tour.updateOne({ _id: req.params.id }, tourData)
            res.redirect('/quantri')
            return
        }
        res.send('NOT FOUND!!!')
    }

    async exportOder(req, res, next) {
            if (req.session.admin) {
                const oderDatas = await booking.find({})
                let oderDatasArr = []
                for (let i = 0; i < oderDatas.length; i++) {
                    let tourname = await tour.findOne({ _id: oderDatas[i].tourId })
                    oderDatasArr.push({
                        tourId: oderDatas[i].tourId,
                        userid: oderDatas[i].userid,
                        username: oderDatas[i].username,
                        tourName: tourname.name,
                        email: oderDatas[i].email,
                        content: oderDatas[i].content,
                        tittle: oderDatas[i].tittle,
                        status: oderDatas[i].status
                    })
                }
                let oders = []
                oderDatasArr.map(item => {
                    oders.push({
                        tourId: item.tourId,
                        userId: item.userid,
                        username: item.username,
                        tourName: item.tourName,
                        email: item.email,
                        content: item.content,
                        tittle: item.tittle,
                        status: (item.status).toString(),
                    })
                })
                const workSheet = XLSX.utils.json_to_sheet(oders)

                const workBook = XLSX.utils.book_new()

                XLSX.utils.book_append_sheet(workBook, workSheet, 'oders')

                XLSX.write(workBook, {
                    bookType: 'xlsx',
                    type: 'buffer'
                })

                XLSX.writeFile(workBook, 'oders.xlsx')
                await booking.deleteMany({ status: false })
                res.download('oders.xlsx')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET /api/findNews/:tittle
    async findNews(req, res, next) {
            const newsDatas = await news.find({})
            const resDatas = []
            newsDatas.map(item => {
                if ((item.tittle).toLowerCase().indexOf(req.params.tittle.toLowerCase()) != -1) {
                    resDatas.push(item)
                }

            })
            res.json(resDatas)
        }
        //GET quantri/addNews
    addNews(req, res, next) {
            let user = checkLogin(req.session)
            if (req.session.admin) {
                res.render('admin/addNews', {
                    user
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST quantri/addNews
    async addNewsForm(req, res, next) {
            if (req.session.admin && req.body.tittle && req.body.thumb_url) {
                let date = new Date()
                const data = {
                    tittle: req.body.tittle,
                    thumb_url: req.body.thumb_url,
                    time: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                    content: []
                }
                for (let i = 0; i < 101; i++) {
                    const contentData = {}
                    if (req.body[`tittle` + `${i}`]) {
                        contentData.tittle = req.body[`tittle` + `${i}`]
                    }
                    if (req.body[`content` + `${i}`]) {
                        contentData.content = req.body[`content` + `${i}`]
                    }
                    if (req.body[`image` + `${i}`]) {
                        contentData.images = req.body[`image` + `${i}`]
                    }
                    if (Object.keys(contentData).length > 0) {
                        data.content.push(contentData)
                    }
                }
                const newsData = new news(data)
                newsData.save()
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET quantri/deleteNews/:id
    async deleteNews(req, res, next) {
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.params.id && req.session.admin) {
                await news.deleteOne({ _id: req.params.id })
                res.redirect('/quantri')
                return
            }
            res.send('NOT FOUND!!!')
        }
        //GET quantri/updateNews/:id
    async updateNews(req, res, next) {
            let user = checkLogin(req.session)
            if (req.params.id && checkHex(req.params.id) && req.params.id.length != 24) {
                res.send('NOT FOUND!!!')
                return
            }
            if (req.session.admin && req.params.id) {
                let newsData = await news.findOne({ _id: req.params.id })
                res.render('admin/updateNews', {
                    user,
                    newsData: mongooseToObject(newsData)
                })
            } else {
                res.send('NOT FOUND!!!')
            }
        }
        //POST quantri/updateNews/:id
    async updateNewsForm(req, res, next) {
        if (req.session.admin && req.body.tittle && req.body.thumb_url) {
            let newsData = await news.findOne({ _id: req.params.id })
            const data = {
                tittle: req.body.tittle,
                thumb_url: req.body.thumb_url,
                time: newsData.time,
                content: []
            }
            for (let i = 0; i < 101; i++) {
                const contentData = {}
                if (req.body[`tittle` + `${i}`]) {
                    contentData.tittle = req.body[`tittle` + `${i}`]
                }
                if (req.body[`content` + `${i}`]) {
                    contentData.content = req.body[`content` + `${i}`]
                }
                if (req.body[`image` + `${i}`]) {
                    contentData.images = req.body[`image` + `${i}`]
                }
                if (Object.keys(contentData).length > 0) {
                    data.content.push(contentData)
                }
            }
            await news.updateOne({ _id: req.params.id }, data)
            res.redirect('/quantri')
            return
        }
        res.send('NOT FOUND!!!')
    }
}
module.exports = new quantriControllers;