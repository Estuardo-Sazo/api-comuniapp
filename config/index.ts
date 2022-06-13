import 'dotenv/config'


export default class Config {
    public port = process.env.API_PORT || 3000;
    public mongoUser: string= process.env.MONGO_USER || '';
    public mongoPassword: string= process.env.MONGO_PASSWORD || '';
    public mongoDb: string= process.env.MONGO_DB || '';
    public mongoURL: string= 'mongodb://localhost:27017/comunidb';

    
}