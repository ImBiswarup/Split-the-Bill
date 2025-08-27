const router = require('express').Router();
const { updatePayment } = require('../controller/payment');

router.put('/update', updatePayment);

module.exports = router;
