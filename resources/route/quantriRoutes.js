const express = require('express');
const quantriControllers = require('../controllers/quantriControllers');
const route = express.Router();

route.get('/deleteAccount/:id', quantriControllers.deleteAccount);
route.get('/resetPasswordAccount/:id', quantriControllers.resetPasswordAccount);
route.get('/api/findAccount/:name', quantriControllers.findAccount);

route.get('/api/findDestination/:name', quantriControllers.findDestination);
route.get('/deleteDestination/:id', quantriControllers.deleteDestination);
route.get('/addDestination/', quantriControllers.addDestination);
route.get('/updateDestination/:id', quantriControllers.updateDestination);
route.post('/addDestination/', quantriControllers.addDestinationForm);
route.post('/updateDestination/:id', quantriControllers.updateDestinationForm);

route.get('/deleteReportComment/:id', quantriControllers.deleteReportComment);
route.get('/deleteAllReportComment/', quantriControllers.deleteAllReportComment);

route.get('/addHomeBanner/', quantriControllers.addHomeBanner);
route.get('/deleteHomeBanner/:id', quantriControllers.deleteHomeBanner);
route.get('/updateHomeBanner/:id', quantriControllers.updateHomeBanner);
route.post('/updateHomeBanner/:id', quantriControllers.updateHomeBannerForm);
route.post('/addHomeBanner/', quantriControllers.addHomeBannerForm);

route.get('/api/findEatingSpot/:name', quantriControllers.findEatingSpot);
route.get('/deleteEatingSpot/:id', quantriControllers.deleteEatingSpot);
route.get('/addEatingSpot/', quantriControllers.addEatingSpot);
route.get('/updateEatingSpot/:id', quantriControllers.updateEatingSpot);
route.post('/updateEatingSpot/:id', quantriControllers.updateEatingSpotForm);
route.post('/addEatingSpot/', quantriControllers.addEatingSpotForm);

route.get('/addspecialDish/', quantriControllers.addspecialDish);
route.post('/addspecialDish/', quantriControllers.addspecialDishForm);
route.get('/deletespecialDish/:id', quantriControllers.deletespecialDish);
route.get('/updatespecialDish/:id', quantriControllers.updatespecialDish);
route.post('/updatespecialDish/:id', quantriControllers.updatespecialDishForm);

route.get('/api/findHotel/:name', quantriControllers.findHotel);
route.get('/addHotel/', quantriControllers.addHotel);
route.get('/deleteHotel/:id', quantriControllers.deleteHotel);
route.get('/updateHotel/:id', quantriControllers.updateHotel);
route.get('/updateHotel/api/service/:id', quantriControllers.getService);
route.post('/addHotel/', quantriControllers.addHotelForm);
route.post('/updateHotel/:id', quantriControllers.updateHotelForm);

route.get('/api/findTour/:name', quantriControllers.findTour);
route.get('/addTour/', quantriControllers.addTour);
route.get('/deleteTour/:id', quantriControllers.deleteTour);
route.get('/updateTour/:id', quantriControllers.updateTour);
route.post('/updateTour/:id', quantriControllers.updateTourForm);
route.post('/addTour/', quantriControllers.addTourForm);

route.get('/tour/oder/export', quantriControllers.exportOder);

route.get('/api/findNews/:tittle', quantriControllers.findNews);
route.get('/deleteNews/:id', quantriControllers.deleteNews);
route.get('/updateNews/:id', quantriControllers.updateNews);
route.get('/addNews/', quantriControllers.addNews);
route.post('/addNews/', quantriControllers.addNewsForm);
route.post('/updateNews/:id', quantriControllers.updateNewsForm);


route.get('/', quantriControllers.home);

module.exports = route;