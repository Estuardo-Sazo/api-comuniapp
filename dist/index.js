"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const users_1 = __importDefault(require("./routes/users"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
//import fileupload from 'express-fileupload';
//import postRoutes from './routes/post';
const server = new server_1.default();
// BODY PARSER FRM ENCODE
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FILEUPLOAD FR
//server.app.use(fileupload());W
// configurar cors
//server.app.use(cors({origin:true, Credential: true}));
/// IMPORTAR RUTAS DE APP
server.app.use('/user', users_1.default);
//server.app.use('/posts', postRoutes);
//CONECTAR DB
mongoose_1.default.connect('mongodb://localhost:27017/comunidb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (err)
        throw err;
    console.log('Base de datos online!');
});
/// Levantar server
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
