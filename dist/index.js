"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
/* import userRoutes from './routes/usuario';
import mongoose from 'mongoose';

import cors from 'cors';
import bodyParser from 'body-parser';
import fileupload from 'express-fileupload';
import postRoutes from './routes/post';
 */
const server = new server_1.default();
/* // BODY PARSER FRM ENCODE
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//FILEUPLOAD FR
server.app.use(fileupload());

// configurar cors
server.app.use(cors({origin:true, Credential:true}));

/// IMPORTAR RUTAS DE APP
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);





//CONECTAR DB
mongoose.connect('mongodb://localhost:27017/appcode', {

    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (err) throw err;
    console.log('Base de datos online!');

});
 */
/// Levantar server
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
