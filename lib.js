const xhr = require('xmlhttprequest').XMLHttpRequest,
    Web3 = require('web3'),
    rpc = require('node-json-rpc');

module.exports = {
    tries:500,
    web3Func:[
        {func:'getBlock',arg:'2000000'},
        {func:'getBalance',arg:'0x56cb9adff6b442697b2eb912a73a618a5b3bea8a'},
        {func:'getTransaction',arg:'0x4eb598c9f98d23e07796528dd14a072691d80de345aca9a848fdcde7bc6186c5'},
        {func:'getTransactionCount',arg:'0x56cb9adff6b442697b2eb912a73a618a5b3bea8a'},
        {func:'getBlockTransactionCount',arg:2000000},
        {func:'getGasPrice',arg:null},
        ],
    rpcFunc:[
        {func:'eth_getBlockByNumber',arg:['2000000', true]},
        {func:'eth_getBalance',arg:['0x56cb9adff6b442697b2eb912a73a618a5b3bea8a']},
        {func:'eth_getTransactionByHash',arg:['0x4eb598c9f98d23e07796528dd14a072691d80de345aca9a848fdcde7bc6186c5']},
        {func:'eth_getTransactionCount',arg:['0x56cb9adff6b442697b2eb912a73a618a5b3bea8a','latest']},
        {func:'eth_getBlockTransactionCountByNumber',arg:['2000000']},
        {func:'eth_gasPrice',arg:[]},
        ],
    testWeb3:function(next){
        const self = this,
            result = [],
            connectUrl = 'http://localhost:8545',
            web3 = new Web3(new Web3.providers.HttpProvider(connectUrl)),
            test = (k,cb) => {
                if(k === self.web3Func.length) cb();
                else{
                    //console.log(self.web3Func[k].func);
                    let timeStart = null,
                        timeFinish = null,
                        aver = [],
                        tfunc = (t,nxt) => {
                            if(t <= 0) {
                                //console.dir(aver);
                                result.push(aver.reduce((a, b) => (a + b))/aver.length);
                                nxt();
                            }else{
                                let cbck = (err,res) => {
                                    timeFinish = new Date;
                                    aver.push(timeFinish - timeStart);
                                    if(err) t = 0;
                                    t = t - 1;
                                    tfunc(t,nxt);
                                };
                                timeStart = new Date();
                                if(self.web3Func[k].arg)
                                    web3.eth[self.web3Func[k].func](self.web3Func[k].arg, cbck);
                                else web3.eth[self.web3Func[k].func](cbck);
                            }
                        };
                    tfunc(self.tries,() => {test(++k,cb)});
                }
            };
        if(!web3.isConnected()) next('Geth not connected!');
        else test(0, () => next(result));
    },
    testNodeRPC:function(next){
        const self = this,
            result = [],
            opts = {
                port:8545,
                host:'127.0.0.1',
                path:'/',
                strict:true
            },
            client = new rpc.Client(opts),
            test = (k,cb) => {
                if(k === self.web3Func.length) cb();
                else{
                    //console.log(self.web3Func[k].func);
                    let timeStart = null,
                        timeFinish = null,
                        aver = [],
                        tfunc = (t,nxt) => {
                            if(t <= 0) {
                                //console.dir(aver);
                                result.push(aver.reduce((a, b) => (a + b))/aver.length);
                                nxt();
                            }else{
                                let cbck = (err,res) => {
                                    timeFinish = new Date;
                                    aver.push(timeFinish - timeStart);
                                    if(err) t = 0;
                                    t = t - 1;
                                    tfunc(t,nxt);
                                };
                                timeStart = new Date();
                                client.call({"jsonrpc": "2.0",
                                    "method": self.web3Func[k].func,
                                    "params":self.web3Func[k].arg,
                                    "id":7
                                },cbck);
                            }
                        };
                    tfunc(self.tries,() => {test(++k,cb)});
                }
            };
        test(0, () => next(result));
    },
    testRPCXHR:function(next){
        const self = this,
            result = [],
            //req = new xhr(),
            test = (k,cb) => {
                if(k === self.web3Func.length) cb();
                else{
                    //console.log(self.web3Func[k].func);
                    let timeStart = null,
                        timeFinish = null,
                        aver = [],
                        tfunc = (t,nxt) => {
                            if(t <= 0) {
                                //console.dir(aver);
                                result.push(aver.reduce((a, b) => (a + b))/aver.length);
                                nxt();
                            }else{
                                let cbck = (err,res) => {
                                    timeFinish = new Date;
                                    aver.push(timeFinish - timeStart);
                                    if(err) t = 0;
                                    t = t - 1;
                                    tfunc(t,nxt);
                                };
                                let req = new xhr();
                                req.open('POST', 'http://localhost:8545');
                                req.onload = () => {cbck(null,1)};
                                req.onerror = (e) => {cbck(e,null)};
                                timeStart = new Date();
                                req.send('{"jsonrpc": "2.0",' +
                                    '"method": ' + self.web3Func[k].func + ',' +
                                    '"params": ' + self.web3Func[k].arg + ','+
                                    '"id":7' +
                                '}')
                            }
                        };
                    tfunc(self.tries,() => {test(++k,cb)});
                }
            };
        test(0, () => next(result));
    }
};