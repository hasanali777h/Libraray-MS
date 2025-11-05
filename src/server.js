'use strict';
const http = require('http');
const config = require('./configs/config');
const connectDB = require('./db/connectDB');
const app = require('./app');
const handleSignal = require('./utils/handleSignal');
const log = require('./utils/logger');
const server = http.createServer(app);
(() => {
    try {
        server.listen(config.port, () => {
            log.info(`http://localhost:${config.port}`);
        });
        connectDB(config.uri);
    } catch (err) {
        log.error('Error starting the server:', err);
    }
})();
process.on('SIGINT', () => handleSignal(server, 'SIGINT'));
process.on('SIGTERM', () => handleSignal(server, 'SIGTERM'));
