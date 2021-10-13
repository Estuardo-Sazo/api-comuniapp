"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() {
    }
    ;
    guardarImageTemp(file, userId) {
        return new Promise((resolve, reject) => {
            //CREAR CARPETA
            const path = this.crearCarpetaUser(userId);
            //Nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            //Mover archivo del Temp a la CARPETA
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    //No se pudo mover
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    crearCarpetaUser(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathTemp = pathUser + '/temp';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathTemp);
        }
        return pathTemp;
    }
    generarNombreUnico(nombreOrg) {
        const nombreArr = nombreOrg.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = (0, uniqid_1.default)();
        return `${idUnico}.${extension}`;
    }
    imagenesTempPosts(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagesTemp(userId, pathTemp);
        imagenesTemp.forEach(img => {
            fs_1.default.renameSync(`${pathTemp}/${img}`, `${pathPost}/${img}`);
        });
        return imagenesTemp;
    }
    obtenerImagesTemp(userId, pathTemp) {
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        //path de posts
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        //img existe
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
