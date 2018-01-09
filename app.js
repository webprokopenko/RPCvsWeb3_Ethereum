let test = require('./lib');

setInterval(()=>test.testNodeRPC(response => console.dir(response)),300);
setInterval(()=>test.testRPCXHR(response => console.dir(response)),3000);
setInterval(()=>test.testWeb3(response => console.dir(response)),3000)
