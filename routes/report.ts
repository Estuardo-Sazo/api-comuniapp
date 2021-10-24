import { Router, Response, Request } from "express";
import { FileUpload } from "../interfaces/file-upload";
import FileSystemReport from "../classes/file-system-report";
import { verificaToken, verificaTokenPermis } from "../middlewares/auth-user";
import { Report } from "../models/report.model";
const reportRoutes = Router();
const fileSystem = new FileSystemReport();


//? GET Reports

reportRoutes.get('/:id',[verificaToken], async (req: any, res: Response) => {
    const id= req.params.id;

    
    const report = await Report.find({_id:id}).populate('user', '-password').populate('type').exec();
        res.json({
        ok: true,
        report
    });
});

//? GET Reports

reportRoutes.get('/',[verificaToken], async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip *= 10;
    
    const id= req.user._id;
    const filter=req.user.type==='USER'?{ $and: [{ user:id }, { status: 'ACTIVE' }] }:{ status: 'ACTIVE'};
    console.log('GET REPORT USER: ',req.user.type)

    const reports = await Report.find(filter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .populate('type')
        .exec();
    res.json({
        ok: true,
        pagina,
        reports
    });
});

//? CREAR  Report
reportRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    console.log('POST: REPORT');

    if(req.typeUser=='USER'){
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }else{
        const body = req.body;
        body.user= req.user._id;

        const imagenes = fileSystem.imagenesTempReport(req.user._id);
        body.imgs = imagenes;
    
        Report.create(body).then(async dataDB => {    
            await dataDB.populate('user', '-password').populate('type').execPopulate(); 
            res.json({
                ok: true,
                report: dataDB
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
});

//? UPLOAD IMAGES
reportRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
    
    console.log('POST: UPLOAD IMG REPORT');


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió ningun archivo"
        });
    }

    const file: FileUpload = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió ningun archivo- imagen"
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió una imagen"
        });
    }

    await fileSystem.guardarImageTemp(file, req.user._id);
    res.status(200).json({
        ok: true,
        file: file.mimetype
    });

});


//? GET IMAGE REPORT
reportRoutes.get('/image/:userId/:img', (req: any, res: Response) => {
    console.log('GET:  IMG REPORT');

    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathImg);
});

//? INANCTIVE COMENT

reportRoutes.post('/delete/:id', [verificaToken], (req: any, res: Response) => {
    console.log('POST:  INACTIVE REPORT');
    const id = req.params.id;
    
    Report.findByIdAndUpdate({ _id: id }, { status: 'INACTIVE' }, { new: true, runValidators: true }, (err: any, report: any) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!report) {
            res.json({
                ok: false,
                token: 'No existe un reporte',
            });
        }

        res.json({
            ok: true,
            report: report,
        });
    });
});

export default reportRoutes;