var express = require('express');
var router = express.Router();
const verifierCtrl = require('../controllers/verifier');

/* GET home page. */
router.get('/', verifierCtrl.index);
router.post('/parse-token', verifierCtrl.parseToken);
router.post('/verify-token', verifierCtrl.verifyToken);

module.exports = router;
