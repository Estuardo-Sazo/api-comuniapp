"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../config/index"));
const config = new index_1.default();
class Server {
    constructor() {
        this.port = config.port;
        this.dbUser = config.mongoUser;
        this.dbPassword = config.mongoPassword;
        this.db = config.mongoDb;
        this.dbUrl = 'mongodb://localhost:27017/comunidb';
        this.app = (0, express_1.default)();
    }
    start(callback) {
        this.app.listen(this.port, callback);
    }
}
exports.default = Server;
