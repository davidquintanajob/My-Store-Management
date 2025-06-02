import {Request,Response} from "express"
import { ServicioController } from "../controllers/ServicioController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class ServicioRouter extends BaseRouter<ServicioController>{
    constructor(){
        super(ServicioController);
    }
    routes(): void {
this.router.get('/Servicio',[verifyToken] ,(req:Request, res:Response) => this.controller.getServicio(req, res));
        // Servicio por id
this.router.get('/Servicio/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.getServicioById(req, res));

        // adicionar Servicio
this.router.post('/Servicio/createServicio',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createServicio(req,res)});

        //modificar Servicio
this.router.put('/Servicio/updateServicio/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.updateServicio(req, res));

        // eliminar Servicio
this.router.delete('/Servicio/deleteServicio/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteServicio(req, res));

this.router.get('/Servicio/getPaginated/:page', [verifyToken], (req: Request, res: Response) => this.controller.getServiciosPaginated(req, res));

this.router.get("/Servicio/gananciastotales/xd",[verifyToken],(req:Request,res:Response)=>this.controller.getAllGanancia(req,res))

this.router.get("/Servicio/filtrarTipo_servicio/:id_tipo_servicio",[verifyToken],(req:Request,res:Response)=>this.controller.getServiciosPorTipo_servicio(req,res))

this.router.post('/Servicio/api/filtrar',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.filtrarServicios(req,res)});

this.router.post('/Servicio/ordenar/all',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.OrdenarServicios(req,res)});

this.router.post('/Servicio/api/filtrarJT',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.filtrarServiciosJT(req,res)});

}
    
    
}