
import { Router, Response, Request } from "express";
import { verificaToken, verificaTokenPermis } from "../middlewares/auth-user";
import {TypeReport} from "../models/type-report.model";
const typeReportRoutes = Router();


//? GET REPORTS

typeReportRoutes.get('/',[verificaToken], async (req: any, res: Response) => {
    console.log('GET: TYPE REPORT');
    
    const typeReports = await TypeReport.find().exec();
    res.json({
        ok: true,
        typeReports
    });
});

//? GET REPORTS ID

typeReportRoutes.get('/:id', async (req: any, res: Response) => {
    const id= req.params.id;
    
     const typeReport = await TypeReport.find({_id:id}).exec();
    res.json({
        ok: true,
        typeReport
    });
});

//? CREAR Type Report
typeReportRoutes.post('/', [verificaToken],[verificaTokenPermis], (req: any, res: Response) => {
    console.log('POST: TYPE REPORT');

    if(req.typeUser=='USER'){
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }else{
        const body = req.body;
        TypeReport.create(body).then(async dataDB => {
    
    
            res.json({
                ok: true,
                typeReport: dataDB
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
});

//? UPDATE TYPE REPORT
typeReportRoutes.post('/update',[verificaToken],[verificaTokenPermis], (req: any, res: Response) => {
    console.log('UPDATE: TYPE REPORT');
    const body = req.body;

    if(req.typeUser=='USER'){
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }else{
        const body = req.body;
        TypeReport.findByIdAndUpdate(body._id, body, { new: true, runValidators: true}, (err: any, dataDB: any) => {   
    
            res.json({
                ok: true,
                typeReport: dataDB
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }

});


export default typeReportRoutes;