import {Request,Response} from "express"
import { DeudaController } from "../controllers/DeudaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class DeudaRouter extends BaseRouter<DeudaController>{
    constructor(){
        super(DeudaController);
    }
    routes(): void {
this.router.get('/Deuda',[verifyToken], (req:Request, res:Response) => this.controller.getDeuda(req, res));
        // Deuda por id
this.router.get('/Deuda/:ID',[verifyToken], (req:Request, res:Response) => this.controller.getDeudaById(req, res));

        // adicionar Deuda
this.router.post('/Deuda/createDeuda',[verifyToken], (req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createDeuda(req,res)});

        //modificar Deuda
        this.router.put('/Deuda/updateDeuda/:ID',[verifyToken], (req:Request, res:Response) => this.controller.updateDeuda(req, res));

        // eliminar Deuda
this.router.delete('/Deuda/deleteDeuda/:ID',[verifyToken], (req:Request, res:Response) => this.controller.deleteDeuda(req, res));
 
this.router.post('/Deuda/api/filtrar',[verifyToken], (req:Request, res:Response) => this.controller.filtrarDeuda(req,res));

}

}