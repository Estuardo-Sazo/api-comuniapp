import express from 'express';
import Config from '../config/index';

const config = new Config();
export default class Server {
    public app: express.Application;
    public port: number|string = config.port;
    public dbUser: string = config.mongoUser;
    public dbPassword: string = config.mongoPassword;
    public db: string = config.mongoDb;
    public dbUrl: string = 'mongodb://localhost:27017/comunidb';


    constructor() {
        this.app = express();
    }
    start(callback: ()=>void) {
        this.app.listen(this.port, callback);
    }
}