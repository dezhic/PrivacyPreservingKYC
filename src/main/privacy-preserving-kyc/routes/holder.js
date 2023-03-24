const express = require('express');
const router = express.Router();
const holderCtrl = require('../controllers/holder');

router.get('/credentials', holderCtrl.listCredentials);

router.post('/receive-invitation', holderCtrl.receiveInvitation);

module.exports = router;
