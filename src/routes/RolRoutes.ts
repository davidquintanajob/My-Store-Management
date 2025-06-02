import {Request,Response} from "express"
import { RolController } from "../controllers/RolController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class RolRouter extends BaseRouter<RolController>{
    constructor(){
        super(RolController);
    }
    routes(): void {
this.router.get('/Rol', [verifyToken],(req:Request, res:Response) => this.controller.getRol(req, res));
        // Rol por id
this.router.get('/Rol/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.getRolById(req, res));

        // adicionar Rol
this.router.post('/Rol/createRol',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createRol(req,res)});

        //modificar Rol
        this.router.put('/Rol/updateRol/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.updateRol(req, res));

        // eliminar Rol
this.router.delete('/Rol/deleteRol/:ID', [verifyToken],(req:Request, res:Response) => this.controller.deleteRol(req, res));
   
this.router.get("/Rol/getPermisos/:id_rol",[verifyToken],(req:Request,res:Response)=>this.controller.getPermisos(req,res))
}

}