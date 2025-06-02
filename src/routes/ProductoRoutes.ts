import {Request,Response} from "express"
import { ProductoController } from "../controllers/ProductoController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";


export class ProductoRouter extends BaseRouter<ProductoController>{
    constructor(){
        super(ProductoController);
    }
    routes(): void {
this.router.get('/Producto', [verifyToken],(req:Request, res:Response) => this.controller.getProducto(req, res));
        // Producto por id
this.router.get('/Producto/:ID', [verifyToken] ,(req:Request, res:Response) => this.controller.getProductoById(req, res));

        // adicionar Producto
this.router.post('/Producto/createProducto', [verifyToken],(req:Request, res:Response) =>{ console.log("Llamamos a response, request"); this.controller.createProducto(req,res)});

        //modificar Producto
this.router.put('/Producto/updateProducto/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.updateProducto(req, res));

        // eliminar Producto
this.router.delete('/Producto/deleteProducto/:ID',[verifyToken] ,(req:Request, res:Response) => this.controller.deleteProducto(req, res));

this.router.get("/Producto/getAllimagenes/:ID",[verifyToken],(req:Request,res:Response)=>this.controller.getAllImages(req,res));

this.router.post("/Producto/api/filtrar",[verifyToken],(req:Request,res:Response)=>this.controller.filtrarProducto(req,res))

this.router.post("/Producto/ordenar/all",[verifyToken],(req:Request,res:Response)=>this.controller.OrdenarProductos(req,res))

this.router.post("/Producto/agregar/Tienda",[verifyToken],(req:Request,res:Response)=>this.controller.AgregarTiendaAProducto(req,res))

this.router.delete("/Producto_tienda/DeleteAllTiendas/inProducto",[verifyToken],(req:Request,res:Response)=>this.controller.DeleteAllTiendasinProducto(req,res))

this.router.post("/Producto/to/excel",[verifyToken],(req:Request,res:Response)=>this.controller.HacerExcel(req,res));

this.router.post("/Producto/import/excel",[verifyToken],(req:Request,res:Response)=>this.controller.ImportarExcel(req,res));

this.router.get("/Producto/getSku/:sku",[verifyToken],(req:Request,res:Response)=>this.controller.findbySku(req,res));

this.router.get("/Producto/getPaginated/:page",[verifyToken],(req:Request,res:Response)=>this.controller.getAllPaginated(req,res));

this.router.post("/Producto/to/excelwithcolumns",[verifyToken],(req:Request,res:Response)=>this.controller.HacerExcelwithColumns(req,res));

this.router.get("/Producto/match/:producto/:tienda",[verifyToken],(req:Request,res:Response)=>this.controller.machearProducto(req,res));

}

}