const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const blockchainService =require('./services/blockchain.service.js');
const Web3 = require('web3');
const accounts = require('./routes/accounts');
const transactions = require('./routes/transactions');

const port = process.env.port || 3000;

app.use(bodyParser.json());


app.use('/api/accounts',accounts);
app.use('/api/transactions',transactions);

app.get('/', (req, res) =>{
  res.send('Service is running');
});

app.listen(port, () => {
  console.log('started on port: ' + port );
  blockchainService.init();
});
