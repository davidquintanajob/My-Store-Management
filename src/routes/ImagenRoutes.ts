import {Request,Response} from "express"
import { ImagenController } from "../controllers/ImagenController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class ImagenRouter extends BaseRouter<ImagenController>{
    constructor(){
        super(ImagenController);
    }
    routes(): void {
this.router.get('/Imagen', [verifyToken],(req:Request, res:Response) => this.controller.getImagen(req, res));
        // Imagen por id
this.router.get('/Imagen/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getImagenById(req, res));

        // adicionar Imagen
this.router.post('/Imagen/createImagen', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createImagen(req,res)});

        //modificar Imagen
        this.router.put('/Imagen/updateImagen/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updateImagen(req, res));

        // eliminar Imagen
this.router.delete('/Imagen/deleteImagen/:ID/:url', [verifyToken],(req:Request, res:Response) => this.controller.deleteImagen(req, res));
    }

}