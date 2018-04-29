const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchain.service.js');
const bodyParser = require('body-parser');


router.get('/', function(req, res) {
   res.json(JSON.stringify("Transaction api"));
});
router.post('/transact/:id', function(req, res) {
    blockchainService.postTransactions(req.params.id).then(function(result){
     res.json(result);
   });
 });
router.post('/transact', function(req, res) {
    var trx ={};
    trx.value ="123";
    console.log(blockchainService.sendTransactions());
    res.send("transaction success");
});

router.get('/pending', function(req, res) {
    res.json(blockchainService.getPendingTransactions());
});


router.get('/confirmed', function(req, res) {
    res.json(blockchainService.getConfirmedTransactions());
});

router.get('/latestblock', function(req, res) {
    res.json(blockchainService.getLatestBlock());
});
router.get('/allblock', function(req, res) {
    res.json(blockchainService.getAllBlock());
});




module.exports = router;