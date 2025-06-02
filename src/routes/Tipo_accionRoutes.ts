import {Request,Response} from "express"
import { Tipo_accionController } from "../controllers/Tipo_accionController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class Tipo_accionRouter extends BaseRouter<Tipo_accionController>{
    constructor(){
        super(Tipo_accionController);
    }
    routes(): void {
this.router.get('/Tipo_accion',[verifyToken] ,(req:Request, res:Response) => this.controller.getTipo_accion(req, res));
        // Tipo_accion por id
this.router.get('/Tipo_accion/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getTipo_accionById(req, res));

        // adicionar Tipo_accion
this.router.post('/Tipo_accion/createTipo_accion',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createTipo_accion(req,res)});

        //modificar Tipo_accion
        this.router.put('/Tipo_accion/updateTipo_accion/:ID',[verifyToken], (req:Request, res:Response) => this.controller.updateTipo_accion(req, res));

        // eliminar Tipo_accion
this.router.delete('/Tipo_accion/deleteTipo_accion/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteTipo_accion(req, res));
    }
}