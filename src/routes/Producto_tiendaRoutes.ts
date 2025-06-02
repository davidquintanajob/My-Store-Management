import {Request,Response} from "express"
import { Producto_tiendaController } from "../controllers/Producto_tiendaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class Producto_tiendaRouter extends BaseRouter<Producto_tiendaController>{
    constructor(){
        super(Producto_tiendaController);
    }
    routes(): void {
this.router.get('/Producto_tienda', [verifyToken],(req:Request, res:Response) => this.controller.getProducto_tienda(req, res));
        // Producto_tienda por id
this.router.get('/Producto_tiendabyID/:id_producto/:id_tienda', [verifyToken],(req:Request, res:Response) => this.controller.getProducto_tiendaById(req, res));

        // adicionar Producto_tienda
this.router.post('/Producto_tienda/createProducto_tienda', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createProducto_tienda(req,res)});

        //modificar Producto_tienda
        this.router.put('/Producto_tienda/updateProducto_tienda', [verifyToken],(req:Request, res:Response) => this.controller.updateProducto_tienda(req, res));

        // eliminar Producto_tienda
this.router.delete('/Producto_tienda/deleteProducto_tienda',[verifyToken], (req:Request, res:Response) => this.controller.deleteProducto_tienda(req, res));

this.router.get("/Producto_tienda/getProductos/:id_tienda",[verifyToken],(req:Request,res:Response)=>this.controller.getProductosbyTienda(req,res))

this.router.get("/Producto_tienda/getTiendas/:id_producto",[verifyToken],(req:Request,res:Response)=>this.controller.getTiendabyProductos(req,res))

this.router.post('/Producto_tienda/MoverProducto_tienda', [verifyToken],(req:Request, res:Response) => this.controller.moverProducto_tienda(req,res));

this.router.get("/Producto_tienda/getCantidadTotal/:id_producto",[verifyToken],(req:Request,res:Response)=>this.controller.getCantidadTotal(req,res))
    
this.router.post("/Producto_tienda/realizarVenta",[verifyToken],(req:Request,res:Response)=>this.controller.realizarVenta(req,res))

this.router.get("/Producto_tienda/filtrarPorCantidad/:cantidad",[verifyToken],(req:Request,res:Response)=>this.controller.filtrarPorCantidades(req,res))

this.router.post("/Producto_tienda/HacerEntrada",[verifyToken],(req:Request,res:Response)=>this.controller.HacerEntrada(req,res))

this.router.delete('/Producto_tienda/delete/in0',[verifyToken], (req:Request, res:Response) => this.controller.deleteProducto_tiendain0(req, res));

this.router.post("/Producto_tienda/api/filtrar",[verifyToken],(req:Request,res:Response)=>this.controller.filtrarProducto_tienda(req,res));

this.router.post("/Producto_tienda/import/excel",[verifyToken],(req:Request,res:Response)=>this.controller.ImportarExcel(req,res));

}

}