import {Request,Response} from "express"
import { Pago_DeudaController } from "../controllers/Pago_deudaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class Pago_DeudaRouter extends BaseRouter<Pago_DeudaController>{
    constructor(){
        super(Pago_DeudaController);
    }
    routes(): void {
this.router.get('/Pago_Deuda', [verifyToken],(req:Request, res:Response) => this.controller.getPago_Deuda(req, res));
        // Pago_Deuda por id
this.router.get('/Pago_Deuda/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getPago_DeudaById(req, res));

        // adicionar Pago_Deuda
this.router.post('/Pago_Deuda/createPago_Deuda', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createPago_Deuda(req,res)});

        //modificar Pago_Deuda
        this.router.put('/Pago_Deuda/updatePago_Deuda/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updatePago_Deuda(req, res));

        // eliminar Pago_Deuda
this.router.delete('/Pago_Deuda/deletePago_Deuda/:ID', [verifyToken],(req:Request, res:Response) => this.controller.deletePago_Deuda(req, res));
    }

}