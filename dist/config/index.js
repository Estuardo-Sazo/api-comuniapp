"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
class Config {
    constructor() {
        this.port = process.env.API_PORT || 3000;
        this.mongoUser = process.env.MONGO_USER || '';
        this.mongoPassword = process.env.MONGO_PASSWORD || '';
        this.mongoDb = process.env.MONGO_DB || '';
        this.mongoURL = 'mongodb://localhost:27017/comunidb';
    }
}
exports.default = Config;
