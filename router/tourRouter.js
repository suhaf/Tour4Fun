const express = require('express');
const tourController = require('../controller/tourController')
const authController = require('./../controller/authController')
//console.log(tourController);

const router = express.Router();

//router.param('id', tourController.checkId);

router.route('/top-*-tours')
      .get(tourController.aliasRoutes, tourController.getAlltours)
router.route('/tour-stats')
      .get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router
    .route('/')
    .get(authController.checkAccess, tourController.getAlltours)
    .post(tourController.createTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .delete(authController.checkAccess, authController.rightToDelete('admin','guide'), tourController.deleteTour)
    .patch(tourController.updateTour);

module.exports = router;