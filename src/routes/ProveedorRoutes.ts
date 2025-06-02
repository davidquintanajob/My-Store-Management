import {Request,Response} from "express"
import { ProveedorController } from "../controllers/ProveedorController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class ProveedorRouter extends BaseRouter<ProveedorController>{
    constructor(){
        super(ProveedorController);
    }
    routes(): void {
this.router.get('/Proveedor',[verifyToken] ,(req:Request, res:Response) => this.controller.getProveedor(req, res));
        // Proveedor por id
this.router.get('/Proveedor/:ID', [verifyToken],(req:Request, res:Response) => this.controller.getProveedorById(req, res));

        // adicionar Proveedor
this.router.post('/Proveedor/createProveedor',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createProveedor(req,res)});

        //modificar Proveedor
        this.router.put('/Proveedor/updateProveedor/:ID',[verifyToken], (req:Request, res:Response) => this.controller.updateProveedor(req, res));

        // eliminar Proveedor
this.router.delete('/Proveedor/deleteProveedor/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteProveedor(req, res));
   
this.router.post('/Proveedor/ordenar/all',[verifyToken] ,(req:Request, res:Response) => this.controller.OrdenarProveedor(req, res));

this.router.post('/Proveedor/api/filtrar',[verifyToken] ,(req:Request, res:Response) => this.controller.FiltrarProveedor(req, res));


}

}