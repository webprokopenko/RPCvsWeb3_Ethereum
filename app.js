let test = require('./lib');

test.testNodeRPC(response => console.dir(response));
test.testRPCXHR(response => console.dir(response));
test.testWeb3(response => console.dir(response));