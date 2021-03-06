import { Router, Response, Request } from "express";
import { FileUpload } from "../interfaces/file-upload";
import { verificaToken, verificaTokenPermis } from "../middlewares/auth-user";
import { Post } from "../models/post.model";
import ImageUpload from "../classes/image-upload";
const imageUpload= new ImageUpload();
const folderImagesName='posts';
const postRoutes = Router();


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

//? UPDATE POST DATE
postRoutes.post('/update-date', [verificaToken],[verificaTokenPermis], (req: any, res: Response) => {

    if(req.typeUser=='USER'){
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }else{
        const body = req.body;      
    
        Post.findByIdAndUpdate(body._id, body, { new: true, runValidators: true}, (err: any, dataDB: any) => {   
    
            res.json({
                ok: true,
                data: dataDB
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
    
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
    
        //const imagenes = fileSystem.imagenesTempPosts(req.user._id);
        const imagenes = imageUpload.moveFileFolderTempToOrginial(req.user._id,folderImagesName);

        body.imgs = imagenes
    
        Post.create(body).then(async postDB => {
    
            await postDB.populate('user', '-password').execPopulate(); 
    
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


//? UPLOAD  IMAGE POST
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
    
    console.log('POST: UPLOAD IMG POST');
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subi?? ningun archivo"
        });
    }

    const file: FileUpload = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subi?? ningun archivo- imagen"
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subi?? una imagen"
        });
    }

    //await fileSystem.guardarImageTemp(file, req.user._id);
    await imageUpload.saveImageTemp(file, req.user._id);
    res.status(200).json({
        ok: true,
        file: file.mimetype
    });

});

//? mGET IMAGE POST
postRoutes.get('/imagen/:userId/:img', (req: any, res: Response) => {
    console.log('GET:  IMG POST');

    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = imageUpload.getUrlFile(userId, img, folderImagesName);

    res.sendFile(pathImg);
});


//! DELETE FILES TEMP
postRoutes.post('/clearTemp/:userId', (req: any, res: Response) => {
    console.log('GET:  CLEAR IMG TEMP POST');

    const userId = req.params.userId;
    const img = req.params.img;
    const repose = imageUpload.deleteFilfeTemp(userId,'temp');

    res.status(200).json({
        ok: true,
        repose
    });
});

//! POSST LIKE
postRoutes.get('/:postId/like', [verificaToken], async (req: any, res: Response) => {
    const postId = req.params.postId;
    console.log('POST LIKE:',postId);    

    const userId= req.user._id;
    
    const likeIs = await Post.find({$and:[{_id:postId},{likes:userId}]}).exec();
    
    if(likeIs.length>0){
        res.json({
            ok: false,
            erro:'Is liked',
            postId            
        });
        return;
    }else{
        Post.findByIdAndUpdate({_id: postId}, {$push: {likes: userId}}, { new: true, runValidators: true}, (err: any, postDB: any) => {
            if (err) {
                res.json({                    
                    ok: false,
                    Error: err,
                });
                return;
            }else if (!postDB) {
                res.json({
                    ok: false,
                    token: 'No existe un post',
                });
                return;
            }
            
            res.json({
                ok: true,
                message:'liked',
                post: postDB,
            });

    
        });
    }
    
});

//! POSST DISLIKE
postRoutes.get('/:postId/dislike', [verificaToken], async (req: any, res: Response) => {
    const postId = req.params.postId;
    console.log('POST DISLIKE:',postId);


    const userId= req.user._id;
    const likeIs = await Post.find({likes:userId}).exec();
    if(likeIs.length===0){
        res.json({
            ok: false,
            erro:'Ya Desliked'            
        });
    }else{
        
        Post.findByIdAndUpdate({_id: postId}, {$pull: {likes: userId}}, { new: true, runValidators: true}, (err: any, postDB: any) => {
            if (err) {
                res.json({                    
                    ok: false,
                    Error: err,
                });
                return;
            } else if (!postDB) {
                res.json({
                    ok: false,
                    token: 'No existe un post',
                });
                return;

            }
            
            res.json({
                ok: true,
                message:'Desliked',
                post: postDB,
            });
    
        });
    }
    
});


export default postRoutes;