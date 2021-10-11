import { Router, Response, Request } from "express";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";
import { verificaToken, verificaTokenPermis } from "../middlewares/auth-user";
import { Post } from "../models/post.model";
const postRoutes = Router();
const fileSystem = new FileSystem();


//? GET POST

postRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip *= 10;

    
    const posts = await Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
});

//? CREAR POST
postRoutes.post('/', [verificaToken],[verificaTokenPermis], (req: any, res: Response) => {

    if(req.typeUser=='USER'){
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }else{
        const body = req.body;
        body.user = req.user._id;
    
        const imagenes = fileSystem.imagenesTempPosts(req.user._id);
        body.imgs = imagenes
    
        Post.create(body).then(async postDB => {
    
            await postDB.populate('usuario', '-password').execPopulate(); postRoutes
    
            res.json({
                ok: true,
                post: postDB
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
    
});


//? Servicio de subida de archivos
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
    

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

//? mostrarimages
postRoutes.get('/imagen/:userId/:img', (req: any, res: Response) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathImg);
});


export default postRoutes;