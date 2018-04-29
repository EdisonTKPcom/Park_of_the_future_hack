const Web3 = require('web3');
var web3 = new Web3();
const Url = require('url');
const provider = new web3.providers.HttpProvider('http://localhost:8545', 0, process.env.ETHERBASE, process.env.PASSWORD);
var account;
var accounts;
// Step 1: Get a contract into my application
// Step 2: Turn that contract into an abstraction I can use
var contract = require("truffle-contract");

var pendingTransactions = [];


class CustomTransaction {
    constructor(hash, send) {
        this.hash = hash;
        this.send = send;
    }
}

module.exports = {
    init: function () {
        web3.setProvider(provider);
        // Step 3: Provision the contract with a web3 provider
        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                console.log('There was an error fetching your accounts.');
            } else if (accs.length == 0) {
                console.log('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly. Or make some accounts on your node.');
            } else {
                accounts = accs;
                account = accs[0];
                console.log('Main account for sending transactions is : ' + account);
            }
        });
        this.watchEvents();
    },
    watchEvents: function () {
        var events;

        var WebSocketServer = require('ws').Server;
        wss = new WebSocketServer({
            port: 40510
        })

        wss.on('connection', function (ws, req) {
            // TODO: Better handling of refreshing page error

            ws.on('message', function (message) {
                console.log('received: %s', message)
            });

            if (req.url === '/events') {
                Ballot.deployed().then(function (instance) {
                    events = instance.allEvents();
                }).then(function () {
                    events.watch(function (error, result) {
                        if (!error) {
                            console.log(result);
                            ws.send(result.transactionHash + '  HAS TYPE: ' + result.type + ' THE EVENT TRIGGERED IS: ' + result.event +
                                ' FOR PROPOSAL: ' + ((result.args.proposal.toNumber() === 0) ? "ETHEREUM" : "HYPERLEDGER"),
                                function data(err) {
                                    if (err) {
                                        // Catch error probably made by refreshing page.
                                    };
                                });
                        }
                    });
                });

            }

            if (req.url === '/pending') {
                // check if transaction is pending and push through websocket 
                setInterval(function () {


                    // check if transaction is pending and push through websocket 
                    pendingTransactions.forEach(ct => {
                        if (!ct.send) {
                            ws.send(ct.hash, function data(err) {
                                if (err) {
                                    // Catch error probably made by refreshing page.
                                };
                            });
                            ct.send = true;
                        }
                    });

                }, 500)
            }

            if (req.url === '/confirmed') {
                setInterval(function () {


                    // check if transaction is pending and push through websocket 
                    pendingTransactions.forEach(ct => {
                        receipt = web3.eth.getTransactionReceipt(ct.hash);
                        if (receipt != null) {
                            // confirmed
                            ws.send(ct.hash, function data(err) {
                                if (err) {
                                    // Catch error probably made by refreshing page.
                                };
                            })
                        }
                        // delete from transaction
                        index = pendingTransactions.indexOf(ct);
                        pendingTransactions.splice(index);
                    });

                }, 1000)


            }


            ws.on('error', err => {
                // Catch error probably made by refreshing page.
            });
            ws.on('close', function () {
                console.log("client closed connection!");
            });
        });
    },

    getAccounts: function () {
        return web3.eth.accounts;
    },
    getBalance: function (account) {
        return web3.eth.getBalance(account);
    },
    sendTransactions: function (trx) {
        // current mined block
        return web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                console.log('There was an error fetching your accounts.');
            } else if (accs.length == 0) {
                console.log('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly. Or make some accounts on your node.');
            } else {
                accounts = accs;
                account = accs[0];
                return web3.eth.sendTransaction({
                    from: accs[1],
                    to: account, 
                    value: web3.toWei("2", "ether"), 
                }, function(err, transactionHash) {
                    if (err) { 
                        console.log(err); 
                        return err;
                    } else {
                        console.log("transactionHash"+transactionHash);
                       return "transactionHash"+transactionHash;
                    }
                });
            }
        });
        
    },
    getPendingTransactions: function () {
        // current mined block
        return web3.eth.getBlock("pending").transactions;
    },

    getConfirmedTransactions: function () {
        // latest block - current head of the blockchain
        return web3.eth.getBlock("latest").transactions;
    },

    getLatestBlock: function () {
        return web3.eth.getBlock("latest");
    },
    getAllBlock: function () {
        var arrayBlock=[];
        for (var i = 0; i < web3.eth.blockNumber ; i++) {
            arrayBlock.push(web3.eth.getBlock(web3.eth.blockNumber - i));
            // web3.eth.getBlock(web3.eth.blockNumber - i)
        }
        return arrayBlock;
    }

}