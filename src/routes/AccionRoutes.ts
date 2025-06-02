import {Request,Response} from "express"
import { AccionController } from "../controllers/AccionController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class AccionRouter extends BaseRouter<AccionController>{
    constructor(){
        super(AccionController);
    }
    routes(): void {
this.router.get('/Accion', [verifyToken],(req:Request, res:Response) => this.controller.getAccion(req, res));
        // Accion por id
this.router.get('/Accion/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.getAccionById(req, res));

        // adicionar Accion
this.router.post('/Accion/createAccion',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createAccion(req,res)});

        //modificar Accion
        this.router.put('/Accion/updateAccion/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updateAccion(req, res));

        // eliminar Accion
this.router.delete('/Accion/deleteAccion/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteAccion(req, res));
    
this.router.get('/Accion/getPaginated/:page', [verifyToken], (req: Request, res: Response) => this.controller.getAccionesPaginated(req, res));

this.router.post('/Accion/api/filtrar',[verifyToken] ,(req:Request, res:Response) =>this.controller.filtrarAccion(req,res));

this.router.post('/Accion/ordenar/all',[verifyToken] ,(req:Request, res:Response) =>this.controller.OrdenarAcciones(req,res));

}

}