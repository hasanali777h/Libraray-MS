'use strict';
const mongoose = require('mongoose');
const log = require('../utils/logger');
const connectDB = (url) => {
    return new Promise((resolve, reject) => {
        try {
            if (url === '' || url === null || url === undefined) {
                reject('Invalid DB URL...');
            }
            const db = mongoose.connect(url);
            resolve(db);
            log.info('MongoDB Connected');
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = connectDB;
