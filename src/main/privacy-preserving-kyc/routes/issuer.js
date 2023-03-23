var express = require('express');
var router = express.Router();
const issuerCtrl = require('../controllers/issuer');

/* GET home page. */
router.get('/', issuerCtrl.index);
// router.post('/login', issuerCtrl.login);
// router.post('/login', issuerCtrl.login);
// router.post('/signup', issuerCtrl.signup);

module.exports = router;
