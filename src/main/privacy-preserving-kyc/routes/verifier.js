var express = require('express');
var router = express.Router();
const verifierCtrl = require('../controllers/verifier');

/* GET home page. */
router.get('/', verifierCtrl.index);
router.post('/parse-token', verifierCtrl.parseToken);

module.exports = router;
