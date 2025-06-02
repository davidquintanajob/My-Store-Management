import {Request,Response} from "express"
import { EncargoController } from "../controllers/EncargoController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class EncargoRouter extends BaseRouter<EncargoController>{
    constructor(){
        super(EncargoController);
    }
    routes(): void {
this.router.get('/Encargo', [verifyToken],(req:Request, res:Response) => this.controller.getEncargo(req, res));
        // Encargo por id
this.router.get('/Encargo/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getEncargoById(req, res));

        // adicionar Encargo
this.router.post('/Encargo/createEncargo', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createEncargo(req,res)});

        //modificar Encargo
        this.router.put('/Encargo/updateEncargo/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updateEncargo(req, res));

        // eliminar Encargo
this.router.delete('/Encargo/deleteEncargo/:ID', [verifyToken],(req:Request, res:Response) => this.controller.deleteEncargo(req, res));
    }

}