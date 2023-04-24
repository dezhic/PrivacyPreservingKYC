const express = require('express');
const router = express.Router();
const holderCtrl = require('../controllers/holder');

router.get('/', holderCtrl.index);
router.get('/credentials', holderCtrl.listCredentials);
router.post('/receive-invitation', holderCtrl.receiveInvitation);
router.get('/connections', holderCtrl.listConnections);
router.post('/generate-zkkyc-token', holderCtrl.generateZkKycToken);


module.exports = router;
