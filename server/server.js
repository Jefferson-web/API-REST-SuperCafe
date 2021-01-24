const http = require('http');
const requestListener = require('./src/app');
require('./src/config');

server = http.createServer(requestListener);

server.listen(process.env.PORT, function () {
    console.log(`Listen on port ${process.env.PORT}`);
});