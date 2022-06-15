import { FileUpload } from "../interfaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class ImageUpload {
    constructor() {

    };

    saveImageTemp(file: FileUpload, useId: string) {
        return new Promise((resolve, reject) => {
            const pathTemp = this.createUserFolder(useId);
            const newFileName= this.generateUniqueFileName(file.name);
        
            file.mv(`${pathTemp}/${newFileName}`, (err:any)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(newFileName);
                }
            });
        });

    }

    private createUserFolder(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathTemp = pathUser + '/temp';

        const userFolderExists = fs.existsSync(pathUser);
        const tempFolderExists = fs.existsSync(pathTemp);

        if (!userFolderExists) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathTemp);
        }else if (!tempFolderExists) {
            fs.mkdirSync(pathTemp);
        }

        return pathTemp;
    }


    private generateUniqueFileName(originalName: string) {
        const nameArray = originalName.split('.');
        const extension = nameArray[nameArray.length - 1];
        const uniqueId = uniqid();
        const newName = `${uniqueId}.${extension}`;
        return newName;
    }

    private getFilesTempFolder(pathTemp: string){
        return fs.readdirSync(pathTemp) || [];
    }

    moveFileFolderTempToOrginial(userId: string, folder: string){
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathOriginal = path.resolve(__dirname, '../uploads/', userId, folder);

        if (!fs.existsSync(pathTemp)) {
            return [];
        }
        if (!fs.existsSync(pathOriginal)) {
            fs.mkdirSync(pathOriginal);
        }

        const filesTemp = this.getFilesTempFolder(pathTemp);

        // Move Folder Files
        filesTemp.forEach(img => {
            fs.renameSync(`${pathTemp}/${img}`, `${pathOriginal}/${img}`)
        });
            
        return filesTemp;
    }

    deleteFilfeTemp(userId: string, folder: string='temp'){
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, folder);
        if (!fs.existsSync(pathTemp)) {
            return 'Not Files';
        }
        const filesTemp = this.getFilesTempFolder(pathTemp);
        
        filesTemp.forEach(img => {
            // Delete files
            fs.unlink(`${pathTemp}/${img}`,(err=>{
                console.log('ERROR DELTE FILE: '+err);
            }));
        });            
        return 'Delete Files Temp o Profile';
    }    

    getUrlFile(userId: string, img: string, folder: string){
        const urlFile = path.resolve(__dirname, '../uploads', userId, folder, img);
        const exist = fs.existsSync(urlFile);
        console.log(exist);
        
        if (!exist) {
            return path.resolve(__dirname, '../assets/400x250.png')
        }
        return urlFile;
    }       
}