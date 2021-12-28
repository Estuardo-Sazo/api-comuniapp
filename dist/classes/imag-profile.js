"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystemProfile {
    constructor() {
    }
    guardarImageProfile(file, userId) {
        return new Promise((resolve, reject) => {
            //CREAR CARPETA
            const path = this.crearCarpetaUser(userId);
            console.log('PATH:', path);
            //Nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            //Mover archivo del Temp a la CARPETA
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    //No se pudo mover
                    reject(err);
                }
                else {
                    resolve(nombreArchivo);
                }
            });
        });
    }
    generarNombreUnico(nombreOrg) {
        const nombreArr = nombreOrg.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = (0, uniqid_1.default)();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUser(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathProfile = pathUser + '/profile';
        const existeUser = fs_1.default.existsSync(pathUser);
        const existeRep = fs_1.default.existsSync(pathProfile);
        if (!existeUser) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathProfile);
        }
        if (!existeRep) {
            fs_1.default.mkdirSync(pathProfile);
        }
        return pathProfile;
    }
    getFotoUrl(userId, img) {
        //path de posts
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'profile', img);
        //img existe
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.png');
        }
        return pathFoto;
    }
}
exports.default = FileSystemProfile;
