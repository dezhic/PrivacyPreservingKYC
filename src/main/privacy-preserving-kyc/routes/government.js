var express = require('express');
var router = express.Router();
const governmentCtrl = require('../controllers/government');

/* GET home page. */
router.get('/', governmentCtrl.index);

module.exports = router;
