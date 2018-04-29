const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchain.service.js');
const bodyParser = require('body-parser');


router.get('/', function(req, res) {
    res.json(blockchainService.getAccounts())
});


router.get('/balance', function(req, res) {
    res.json(blockchainService.getBalance("0x69a94caa9e3b0afce8f1bdbc6fe4a1f803abf1f0"));
});


module.exports = router;