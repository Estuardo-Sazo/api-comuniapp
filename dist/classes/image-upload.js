"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class ImageUpload {
    constructor() {
    }
    ;
    saveImageTemp(file, useId) {
        return new Promise((resolve, reject) => {
            const pathTemp = this.createUserFolder(useId);
            const newFileName = this.generateUniqueFileName(file.name);
            file.mv(`${pathTemp}/${newFileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(newFileName);
                }
            });
        });
    }
    createUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathTemp = pathUser + '/temp';
        const userFolderExists = fs_1.default.existsSync(pathUser);
        const tempFolderExists = fs_1.default.existsSync(pathTemp);
        if (!userFolderExists) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathTemp);
        }
        else if (!tempFolderExists) {
            fs_1.default.mkdirSync(pathTemp);
        }
        return pathTemp;
    }
    generateUniqueFileName(originalName) {
        const nameArray = originalName.split('.');
        const extension = nameArray[nameArray.length - 1];
        const uniqueId = (0, uniqid_1.default)();
        const newName = `${uniqueId}.${extension}`;
        return newName;
    }
    getFilesTempFolder(pathTemp) {
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    moveFileFolderTempToOrginial(userId, folder) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathOriginal = path_1.default.resolve(__dirname, '../uploads/', userId, folder);
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathOriginal)) {
            fs_1.default.mkdirSync(pathOriginal);
        }
        const filesTemp = this.getFilesTempFolder(pathTemp);
        // Move Folder Files
        filesTemp.forEach(img => {
            fs_1.default.renameSync(`${pathTemp}/${img}`, `${pathOriginal}/${img}`);
        });
        return filesTemp;
    }
    deleteFilfeTemp(userId, folder = 'temp') {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, folder);
        if (!fs_1.default.existsSync(pathTemp)) {
            return 'Not Files';
        }
        const filesTemp = this.getFilesTempFolder(pathTemp);
        filesTemp.forEach(img => {
            // Delete files
            fs_1.default.unlink(`${pathTemp}/${img}`, (err => {
                console.log('ERROR DELTE FILE: ' + err);
            }));
        });
        return 'Delete Files Temp o Profile';
    }
    getUrlFile(userId, img, folder) {
        const urlFile = path_1.default.resolve(__dirname, '../uploads', userId, folder, img);
        const exist = fs_1.default.existsSync(urlFile);
        console.log(exist);
        if (!exist) {
            return path_1.default.resolve(__dirname, '../assets/400x250.png');
        }
        return urlFile;
    }
}
exports.default = ImageUpload;
