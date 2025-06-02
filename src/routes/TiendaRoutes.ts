import {Request,Response} from "express"
import { TiendaController} from "../controllers/TiendaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class TiendaRouter extends BaseRouter<TiendaController>{
    constructor(){
        super(TiendaController);
    }
    routes(): void {
this.router.get('/Tienda',[verifyToken] ,(req:Request, res:Response) => this.controller.getTienda(req, res));
        // Tienda por id
this.router.get('/Tienda/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.getTiendaById(req, res));

        // adicionar Tienda
this.router.post('/Tienda/createTienda',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createTienda(req,res)});

        //modificar Tienda
this.router.put('/Tienda/updateTienda/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.updateTienda(req, res));

        // eliminar Tienda
this.router.delete('/Tienda/deleteTienda/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteTienda(req, res));
   
this.router.get("/Tienda/getServicios/:id_tienda",[verifyToken],(req:Request,res:Response)=>this.controller.ServiciosbyTienda(req,res))

this.router.get("/Tienda/getTiendas/noUsuarios/:id_usuario",[verifyToken],(req:Request,res:Response)=>this.controller.NoTiendasUsuario(req,res))
}

}