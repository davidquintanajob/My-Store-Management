import {Request,Response} from "express"
import { Rol_permisoController } from "../controllers/Rol_permisoController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class Rol_permisoRouter extends BaseRouter<Rol_permisoController>{
    constructor(){
        super(Rol_permisoController);
    }
    routes(): void {
this.router.get('/Rol_permiso',[verifyToken] ,(req:Request, res:Response) => this.controller.getRol_permiso(req, res));
        // Rol_permiso por id
this.router.get('/Rol_permisobyId/:id_rol/:id_permiso',[verifyToken] ,(req:Request, res:Response) => this.controller.getRol_permisoById(req, res));

        // adicionar Rol_permiso
this.router.post('/Rol_permiso/createRol_permiso',[verifyToken], (req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createRol_permiso(req,res)});

        //modificar Rol_permiso
        this.router.put('/Rol_permiso/updateRol_permiso', [verifyToken],(req:Request, res:Response) => this.controller.updateRol_permiso(req, res));

        // eliminar Rol_permiso
this.router.delete('/Rol_permiso/deleteRol_permiso',[verifyToken], (req:Request, res:Response) => this.controller.deleteRol_permiso(req, res));
   
this.router.get("/Rol_permiso/getPermisosbyRol/:id_rol",[verifyToken],(req:Request,res:Response)=>this.controller.PermisobyRol(req,res));

}

}