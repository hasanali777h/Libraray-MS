'use strict';
const log = require("../utils/logger")
const handleSignal = (server, signal) => {
    if (signal == 'SIGINT') {
        server.close(() => {
            log.info('SIGINT received, Shutting down successfully...')
            process.exit(0);
        })
    }
    if (signal == 'SIGTERM') {
        server.close(() => {
            log.error('An interruption occurred, Shutting down forcefully...')
            process.exit(1);
        })
    }
}
module.exports = handleSignal
