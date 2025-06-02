import {Request,Response} from "express"
import { UsuarioController } from "../controllers/UsuarioController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class UsuarioRouter extends BaseRouter<UsuarioController>{
    constructor(){
        super(UsuarioController);
    }
    routes(): void {
this.router.get('/Usuario',[verifyToken], (req:Request, res:Response) => this.controller.getUsuario(req, res));
        // Usuario por id
this.router.get('/Usuario/:ID',[verifyToken], (req:Request, res:Response) => this.controller.getUsuarioById(req, res));

        // adicionar Usuario
this.router.post('/Usuario/createUsuario',[verifyToken] ,(req:Request, res:Response) => this.controller.createUsuario(req,res));

        //modificar Usuario
this.router.put('/Usuario/updateUsuario/:ID', [verifyToken],(req:Request, res:Response) => this.controller.updateUsuario(req, res));

        // eliminar Usuario
this.router.delete('/Usuario/deleteUsuario/:ID',[verifyToken], (req:Request, res:Response) => this.controller.deleteUsuario(req, res));
    
this.router.post("/Usuario/auth",(req,res)=>this.controller.authUser(req,res));

this.router.get("/Usuario/permisos_especiales/:id_usuario",[verifyToken],(req:Request,res:Response)=>this.controller.getPermisosEspeciales(req,res))

this.router.get("/Usuario/permiso_especial/:id_usuario/:id_permiso",[verifyToken],(req:Request,res:Response)=>this.controller.PermisoEspecialUsuario(req,res))

this.router.post("/Usuario/change/pass",[verifyToken],(req:Request,res:Response)=>this.controller.changePassword(req,res));

this.router.post("/Usuario/api/filtrar",[verifyToken],(req:Request,res:Response)=>this.controller.filtrarUsuario(req,res));

this.router.post("/Usuario/ordenar/all",[verifyToken],(req:Request,res:Response)=>this.controller.OrdenarUsuarios(req,res));

this.router.get("/Usuario/tiene_permiso/:id_usuario/:id_permiso",[verifyToken],(req:Request,res:Response)=>this.controller.obtenerUsuarioPermiso(req,res))

this.router.get("/Usuario/recupearContrasenna/:nombre_usuario",[verifyToken],(req:Request,res:Response)=>this.controller.recuperarContrasenna(req,res))

}

}