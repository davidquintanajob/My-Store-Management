import {Request,Response} from "express"
import { PermisoController } from "../controllers/PermisoController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class PermisoRouter extends BaseRouter<PermisoController>{
    constructor(){
        super(PermisoController);
    }
    routes(): void {
this.router.get('/Permiso', [verifyToken],(req:Request, res:Response) => this.controller.getPermiso(req, res));
        // Permiso por id
this.router.get('/Permiso/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getPermisoById(req, res));

        // adicionar Permiso
this.router.post('/Permiso/createPermiso', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createPermiso(req,res)});

        //modificar Permiso
this.router.put('/Permiso/updatePermiso/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updatePermiso(req, res));

        // eliminar Permiso
this.router.delete('/Permiso/deletePermiso/:ID', [verifyToken],(req:Request, res:Response) => this.controller.deletePermiso(req, res));
    }

}