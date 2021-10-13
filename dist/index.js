"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const users_1 = __importDefault(require("./routes/users"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const type_report_1 = __importDefault(require("./routes/type-report"));
const report_1 = __importDefault(require("./routes/report"));
const server = new server_1.default();
// BODY PARSER FRM ENCODE
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FILEUPLOAD FR
server.app.use((0, express_fileupload_1.default)());
// configurar cors
server.app.use((0, cors_1.default)({ origin: true, Credential: true }));
/// IMPORTAR RUTAS DE APP
server.app.use('/user', users_1.default);
server.app.use('/posts', post_1.default);
server.app.use('/type-report', type_report_1.default);
server.app.use('/reports', report_1.default);
//CONECTAR DB
mongoose_1.default.connect('mongodb://localhost:27017/comunidb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}, (err) => {
    if (err)
        throw err;
    console.log('Base de datos online!');
});
/// Levantar server
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
