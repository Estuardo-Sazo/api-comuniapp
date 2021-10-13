import Server from './classes/server';
 import userRoutes from './routes/users';
import mongoose from 'mongoose';

import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileupload from 'express-fileupload';
import typeReportRoutes from './routes/type-report';
import reportRoutes from './routes/report';

const server = new Server();

// BODY PARSER FRM ENCODE
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//FILEUPLOAD FR
server.app.use(fileupload());

// configurar cors
server.app.use(cors({origin:true, Credential:true}));

/// IMPORTAR RUTAS DE APP
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);
server.app.use('/type-report', typeReportRoutes);
server.app.use('/reports', reportRoutes);




//CONECTAR DB
mongoose.connect('mongodb://localhost:27017/comunidb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}, (err) => {
    if (err) throw err;
    console.log('Base de datos online!');

});
 
/// Levantar server
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);

})