
const express = require('express');
const { Checkout } = require('../controllers/Checkout');
const {handleSuccessfulPayment} = require("../controllers/ProcessOrder");

const router = express.Router();

// ********************************************************************************************************
//                                      checkout routes
// ********************************************************************************************************

router.post('/create-checkout-session', Checkout);

// ********************************************************************************************************
//                                  payment success routes
// ********************************************************************************************************


router.post('/payment-success',handleSuccessfulPayment)

module.exports = router;