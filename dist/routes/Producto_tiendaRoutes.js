"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto_tiendaRouter = void 0;
const Producto_tiendaController_1 = require("../controllers/Producto_tiendaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class Producto_tiendaRouter extends router_1.BaseRouter {
    constructor() {
        super(Producto_tiendaController_1.Producto_tiendaController);
    }
    routes() {
        this.router.get('/Producto_tienda', [jwt_config_1.verifyToken], (req, res) => this.controller.getProducto_tienda(req, res));
        // Producto_tienda por id
        this.router.get('/Producto_tiendabyID/:id_producto/:id_tienda', [jwt_config_1.verifyToken], (req, res) => this.controller.getProducto_tiendaById(req, res));
        // adicionar Producto_tienda
        this.router.post('/Producto_tienda/createProducto_tienda', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createProducto_tienda(req, res); });
        //modificar Producto_tienda
        this.router.put('/Producto_tienda/updateProducto_tienda', [jwt_config_1.verifyToken], (req, res) => this.controller.updateProducto_tienda(req, res));
        // eliminar Producto_tienda
        this.router.delete('/Producto_tienda/deleteProducto_tienda', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteProducto_tienda(req, res));
        this.router.get("/Producto_tienda/getProductos/:id_tienda", [jwt_config_1.verifyToken], (req, res) => this.controller.getProductosbyTienda(req, res));
        this.router.get("/Producto_tienda/getTiendas/:id_producto", [jwt_config_1.verifyToken], (req, res) => this.controller.getTiendabyProductos(req, res));
        this.router.post('/Producto_tienda/MoverProducto_tienda', [jwt_config_1.verifyToken], (req, res) => this.controller.moverProducto_tienda(req, res));
        this.router.get("/Producto_tienda/getCantidadTotal/:id_producto", [jwt_config_1.verifyToken], (req, res) => this.controller.getCantidadTotal(req, res));
        this.router.post("/Producto_tienda/realizarVenta", [jwt_config_1.verifyToken], (req, res) => this.controller.realizarVenta(req, res));
        this.router.get("/Producto_tienda/filtrarPorCantidad/:cantidad", [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarPorCantidades(req, res));
        this.router.post("/Producto_tienda/HacerEntrada", [jwt_config_1.verifyToken], (req, res) => this.controller.HacerEntrada(req, res));
        this.router.delete('/Producto_tienda/delete/in0', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteProducto_tiendain0(req, res));
        this.router.post("/Producto_tienda/api/filtrar", [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarProducto_tienda(req, res));
        this.router.post("/Producto_tienda/import/excel", [jwt_config_1.verifyToken], (req, res) => this.controller.ImportarExcel(req, res));
    }
}
exports.Producto_tiendaRouter = Producto_tiendaRouter;
