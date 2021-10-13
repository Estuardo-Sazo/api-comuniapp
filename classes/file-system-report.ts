import { FileUpload } from "../interfaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystemReport {
    constructor() {

    };

    guardarImageTemp(file: FileUpload, userId: string) {

        return new Promise((resolve, reject) => {

            //CREAR CARPETA
            const path = this.crearCarpetaUser(userId);

            //Nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);

            //Mover archivo del Temp a la CARPETA
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    //No se pudo mover
                    reject(err);
                } else {
                    resolve();
                }
            });
        });


    }


    private crearCarpetaUser(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathTemp = pathUser + '/tempReport';

        const existeUser = fs.existsSync(pathUser);
        const existeRep = fs.existsSync(pathTemp);

        if (!existeUser) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathTemp);
        }
        if (!existeRep) {
            fs.mkdirSync(pathTemp);
        }

        return pathTemp;

    }

    private generarNombreUnico(nombreOrg: string) {
        const nombreArr = nombreOrg.split('.');
        const extension = nombreArr[nombreArr.length - 1];

        const idUnico = uniqid();
        return `${idUnico}.${extension}`;

    }

    imagenesTempReport(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'tempReport');
        const pathReport = path.resolve(__dirname, '../uploads/', userId, 'reports');
        if (!fs.existsSync(pathTemp)) {
            return [];
        }
        if (!fs.existsSync(pathReport)) {
            fs.mkdirSync(pathReport);
        }

        const imagenesTemp = this.obtenerImagesTemp(userId, pathTemp);
        imagenesTemp.forEach(img => {
            fs.renameSync(`${pathTemp}/${img}`, `${pathReport}/${img}`)
        });

        return imagenesTemp;
    }

    private obtenerImagesTemp(userId: string, pathTemp: string) {
        return fs.readdirSync(pathTemp) || [];
    }


    getFotoUrl(userId: string, img: string) {
        //path de posts
        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'reports', img);

        //img existe
        const existe = fs.existsSync(pathFoto);
        if (!existe) {
            return path.resolve(__dirname, '../assets/400x250.jpg')
        }

        return pathFoto;
    }
}