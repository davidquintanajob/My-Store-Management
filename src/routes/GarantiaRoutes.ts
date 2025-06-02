import {Request,Response} from "express"
import { GarantiaController } from "../controllers/GarantiaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class GarantiaRouter extends BaseRouter<GarantiaController>{
    constructor(){
        super(GarantiaController);
    }
    routes(): void {
this.router.get('/Garantia',[verifyToken],(req:Request, res:Response) => this.controller.getGarantia(req, res));
        // Garantia por id
this.router.get('/Garantia/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getGarantiaById(req, res));

        // adicionar Garantia
this.router.post('/Garantia/createGarantia', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createGarantia(req,res)});

        //modificar Garantia
        this.router.put('/Garantia/updateGarantia/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updateGarantia(req, res));

        // eliminar Garantia
this.router.delete('/Garantia/deleteGarantia/:ID', [verifyToken],(req:Request, res:Response) => this.controller.deleteGarantia(req, res));
    
this.router.post('/Garantia/api/filtrar', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.filtrarGarantia(req,res)});

}

}