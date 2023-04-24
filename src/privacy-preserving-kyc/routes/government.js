var express = require('express');
var router = express.Router();
const governmentCtrl = require('../controllers/government');

/* GET home page. */
router.get('/', governmentCtrl.index);
router.post('/decrypt-token', governmentCtrl.decryptToken);

module.exports = router;
