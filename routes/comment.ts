import { Router, Response, Request } from "express";
import { verificaToken, verificaTokenPermis } from "../middlewares/auth-user";
import { Comment } from "../models/comments.model";
const commentRoutes = Router();

//? CREAR POST
commentRoutes.post('/:reference', [verificaToken], (req: any, res: Response) => {
    const reference = req.params.reference;
    const body = req.body;
    body.user = req.user._id;
    body.reference = reference;
    Comment.create(body).then(async commenetDB => {
        await commenetDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            comment: commenetDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});

//? GET COMENT

commentRoutes.get('/:reference', [verificaToken], async (req: any, res: Response) => {
    const reference = req.params.reference;
    const comments = await Comment.find({ $and: [{ reference }, { status: 'ACTIVE' }] }).populate('user', '-password').exec();
    res.json({
        ok: true,
        comments
    });
});
//? INANCTIVE COMENT

commentRoutes.post('/delete/:id', [verificaToken], (req: any, res: Response) => {
    const id = req.params.id;

    Comment.findByIdAndUpdate({ _id: id }, { status: 'INACTIVE' }, { new: true, runValidators: true }, (err: any, commenetDB: any) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!commenetDB) {
            res.json({
                ok: false,
                token: 'No existe un usuario',
            });
        }

        res.json({
            ok: true,
            comment: commenetDB,
        });
    });
});

//? UPDATE COMENT
commentRoutes.post('/update/:id', [verificaToken], (req: any, res: Response) => {
    const id = req.params.id;

    const body = req.body;
    Comment.findByIdAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err: any, commenetDB: any) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!commenetDB) {
            res.json({
                ok: false,
                token: 'No existe un usuario',
            });
        }

        res.json({
            ok: true,
            comment: commenetDB,
        });
    });


});


export default commentRoutes;