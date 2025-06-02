import {Request,Response} from "express"
import { ClienteController } from "../controllers/ClienteController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class ClienteRouter extends BaseRouter<ClienteController>{
    constructor(){
        super(ClienteController);
    }
    routes(): void {
this.router.get('/Cliente',[verifyToken], (req:Request, res:Response) => this.controller.getCliente(req, res));
        // Cliente por id
this.router.get('/Cliente/:ID',[verifyToken], (req:Request, res:Response) => this.controller.getClienteById(req, res));

        // adicionar Cliente
this.router.post('/Cliente/createCliente',[verifyToken], (req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createCliente(req,res)});

        //modificar Cliente
        this.router.put('/Cliente/updateCliente/:ID',[verifyToken], (req:Request, res:Response) => this.controller.updateCliente(req, res));

        // eliminar Cliente
this.router.delete('/Cliente/deleteCliente/:ID',[verifyToken], (req:Request, res:Response) => this.controller.deleteCliente(req, res));
   
this.router.post('/Cliente/api/filtrar',[verifyToken], (req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.filtrarCliente(req,res)});

this.router.post('/Cliente/ordenar/all',[verifyToken], (req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.OrdenarCliente(req,res)});

}

}