import {Request,Response} from "express"
import { MonedaController } from "../controllers/MonedaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class MonedaRouter extends BaseRouter<MonedaController>{
    constructor(){
        super(MonedaController);
    }
    routes(): void {

this.router.get('/Moneda/obtener/USD', [verifyToken],(req:Request, res:Response) => this.controller.getMonedaByArchivo(req, res));

this.router.put('/Moneda/cambiar/USD/:valor', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.updateMonedaByArchivo(req,res)});



}

}