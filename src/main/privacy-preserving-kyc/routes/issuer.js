var express = require('express');
var router = express.Router();
const issuerCtrl = require('../controllers/issuer');
const isAuth = require('../policies/isAuth');

/* GET home page. */
router.get('/', issuerCtrl.index);
router.post('/login', issuerCtrl.login);
// router.post('/login', issuerCtrl.login);
router.post('/signup', issuerCtrl.signup);

router.post('/credential/request', isAuth, issuerCtrl.requestCredential);

router.get('/customer-info', isAuth, issuerCtrl.getCustomerInfo);

router.post('/create-invitation', isAuth, issuerCtrl.createInvitation);

router.get('/last-connection', isAuth, issuerCtrl.getLastConnection);

router.get('/invitation', isAuth, issuerCtrl.getInvitationByConnectionId);

router.get('/credentials', isAuth, issuerCtrl.getCredentials);

module.exports = router;
