const express = require('express');
const router = new express.Router();

router.use('/card', require('./card'));

router.post('/pay', require('./pay/post'));
router.post('/refund', require('./refund/post'));

module.exports = router;
