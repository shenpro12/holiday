const siteRoutes = require('./siteRoutes')
const dichvuRoutes = require('./dichvuRoutes')
const diemdenRoute = require('./diemthamquanRoutes')
const hotelRoutes = require('./hotelRoutes')
const taikhoanRoutes = require('./taikhoanRoutes')
const commentRoutes = require('./commentRoutes')
const diemanuongRoutes = require('./diemanuongRoutes')
const quantriRoutes = require('./quantriRoutes')
const newsRoutes = require('./newsRoutes')
const mapRoutes = require('./bandoRoutes')

function route(app) {
    app.use('/map', mapRoutes);
    app.use('/quantri', quantriRoutes);
    app.use('/news', newsRoutes);
    app.use('/taikhoan', taikhoanRoutes);
    app.use('/dichvu', dichvuRoutes);
    app.use('/diemanuong', diemanuongRoutes);
    app.use('/diemden', diemdenRoute);
    app.use('/comment', commentRoutes);
    app.use('/hotel', hotelRoutes);
    app.use('/', siteRoutes);
}
module.exports = route;