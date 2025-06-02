"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoRouter = void 0;
const ProductoController_1 = require("../controllers/ProductoController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class ProductoRouter extends router_1.BaseRouter {
    constructor() {
        super(ProductoController_1.ProductoController);
    }
    routes() {
        this.router.get('/Producto', [jwt_config_1.verifyToken], (req, res) => this.controller.getProducto(req, res));
        // Producto por id
        this.router.get('/Producto/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getProductoById(req, res));
        // adicionar Producto
        this.router.post('/Producto/createProducto', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createProducto(req, res); });
        //modificar Producto
        this.router.put('/Producto/updateProducto/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateProducto(req, res));
        // eliminar Producto
        this.router.delete('/Producto/deleteProducto/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteProducto(req, res));
        this.router.get("/Producto/getAllimagenes/:ID", [jwt_config_1.verifyToken], (req, res) => this.controller.getAllImages(req, res));
        this.router.post("/Producto/api/filtrar", [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarProducto(req, res));
        this.router.post("/Producto/ordenar/all", [jwt_config_1.verifyToken], (req, res) => this.controller.OrdenarProductos(req, res));
        this.router.post("/Producto/agregar/Tienda", [jwt_config_1.verifyToken], (req, res) => this.controller.AgregarTiendaAProducto(req, res));
        this.router.delete("/Producto_tienda/DeleteAllTiendas/inProducto", [jwt_config_1.verifyToken], (req, res) => this.controller.DeleteAllTiendasinProducto(req, res));
        this.router.post("/Producto/to/excel", [jwt_config_1.verifyToken], (req, res) => this.controller.HacerExcel(req, res));
        this.router.post("/Producto/import/excel", [jwt_config_1.verifyToken], (req, res) => this.controller.ImportarExcel(req, res));
        this.router.get("/Producto/getSku/:sku", [jwt_config_1.verifyToken], (req, res) => this.controller.findbySku(req, res));
        this.router.get("/Producto/getPaginated/:page", [jwt_config_1.verifyToken], (req, res) => this.controller.getAllPaginated(req, res));
        this.router.post("/Producto/to/excelwithcolumns", [jwt_config_1.verifyToken], (req, res) => this.controller.HacerExcelwithColumns(req, res));
        this.router.get("/Producto/match/:producto/:tienda", [jwt_config_1.verifyToken], (req, res) => this.controller.machearProducto(req, res));
    }
}
exports.ProductoRouter = ProductoRouter;
