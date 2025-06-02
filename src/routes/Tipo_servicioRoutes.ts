import {Request,Response} from "express"
import { Tipo_servicioController } from "../controllers/Tipo_servicioController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class Tipo_servicioRouter extends BaseRouter<Tipo_servicioController>{
    constructor(){
        super(Tipo_servicioController);
    }
    routes(): void {
this.router.get('/Tipo_servicio',[verifyToken], (req:Request, res:Response) => this.controller.getTipo_servicio(req, res));
        // Tipo_servicio por id
this.router.get('/Tipo_servicio/:ID',[verifyToken], (req:Request, res:Response) => this.controller.getTipo_servicioById(req, res));

        // adicionar Tipo_servicio
this.router.post('/Tipo_servicio/createTipo_servicio',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createTipo_servicio(req,res)});

        //modificar Tipo_servicio
        this.router.put('/Tipo_servicio/updateTipo_servicio/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.updateTipo_servicio(req, res));

        // eliminar Tipo_servicio
this.router.delete('/Tipo_servicio/deleteTipo_servicio/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteTipo_servicio(req, res));
    
this.router.post('/Tipo_servicio/api/filtrar',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.filtrarTipo_servicio(req,res)});

}

}