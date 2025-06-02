import {Request,Response} from "express"
import { SalidaController } from "../controllers/SalidaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class SalidaRouter extends BaseRouter<SalidaController>{
    constructor(){
        super(SalidaController);
    }
    routes(): void {
this.router.get('/Salida', [verifyToken],(req:Request, res:Response) => this.controller.getSalida(req, res));
        // Salida por id
this.router.get('/Salida/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getSalidaById(req, res));

        // adicionar Salida
this.router.post('/Salida/createSalida', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createSalida(req,res)});

        //modificar Salida
        this.router.put('/Salida/updateSalida/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updateSalida(req, res));

        // eliminar Salida
this.router.delete('/Salida/deleteSalida/:ID', [verifyToken],(req:Request, res:Response) => this.controller.deleteSalida(req, res));
    
this.router.get('/Salida/getPaginated/:page', [verifyToken], (req: Request, res: Response) => this.controller.getSalidasPaginated(req, res));

this.router.post('/Salida/ordenar/all', [verifyToken],(req:Request, res:Response) =>this.controller.OrdenarSalida(req,res));

this.router.post('/Salida/api/filtrar', [verifyToken],(req:Request, res:Response) =>this.controller.filtrarSalida(req,res));

this.router.post('/Salida/api/filtrarJT', [verifyToken],(req:Request, res:Response) =>this.controller.filtrarSalidaJT(req,res));

}

}