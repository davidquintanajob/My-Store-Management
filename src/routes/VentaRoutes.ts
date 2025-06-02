import {Request,Response} from "express"
import { VentaController } from "../controllers/VentaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class VentaRouter extends BaseRouter<VentaController>{
    constructor(){
        super(VentaController);
    }
    routes(): void {
this.router.get('/Venta',[verifyToken], (req:Request, res:Response) => this.controller.getVenta(req, res));
        // Venta por id
this.router.get('/VentabyId/:id_producto/:id_servicio',[verifyToken] ,(req:Request, res:Response) => this.controller.getVentaById(req, res));

        // adicionar Venta
this.router.post('/Venta/createVenta',[verifyToken] ,(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createVenta(req,res)});

        //modificar Venta
        this.router.put('/Venta/updateVenta',[verifyToken] ,(req:Request, res:Response) => this.controller.updateVenta(req, res));

        // eliminar Venta
this.router.delete('/Venta/deleteVenta/:id_producto/:id_servicio',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteVenta(req, res));
   
this.router.get("/Venta/getProductosMasVendidos/all",[verifyToken],(req:Request,res:Response)=>this.controller.listaVendidos(req,res));

this.router.get("/Venta/getProductosMasVendidos/porFecha",[verifyToken],(req:Request,res:Response)=>this.controller.listaVendidosPorFecha(req,res));

this.router.get("/Venta/getbyProducto/:id_producto",[verifyToken],(req:Request,res:Response)=>this.controller.findVentabyId_producto(req,res));

this.router.get("/Venta/getbyServicio/:id_servicio",[verifyToken],(req:Request,res:Response)=>this.controller.findVentabyId_servicio(req,res));

}

}