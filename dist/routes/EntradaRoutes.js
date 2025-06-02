"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntradaRouter = void 0;
const EntradaController_1 = require("../controllers/EntradaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class EntradaRouter extends router_1.BaseRouter {
    constructor() {
        super(EntradaController_1.EntradaController);
    }
    routes() {
        this.router.get("/Entrada", [jwt_config_1.verifyToken], (req, res) => this.controller.getEntrada(req, res));
        // Entrada por id
        this.router.get("/Entrada/:ID", [jwt_config_1.verifyToken], (req, res) => this.controller.getEntradaById(req, res));
        // adicionar Entrada
        this.router.post("/Entrada/createEntrada", [jwt_config_1.verifyToken], (req, res) => {
            console.log("Llamamos a response, request");
            this.controller.createEntrada(req, res);
        });
        //modificar Entrada
        this.router.put("/Entrada/updateEntrada/:ID", [jwt_config_1.verifyToken], (req, res) => this.controller.updateEntrada(req, res));
        // eliminar Entrada
        this.router.delete("/Entrada/deleteEntrada/:ID", [jwt_config_1.verifyToken], (req, res) => this.controller.deleteEntrada(req, res));
        this.router.get("/Entrada/getProveedores/:id_proveedor", [jwt_config_1.verifyToken], (req, res) => this.controller.getAllEntradasbyProveedor(req, res));
        this.router.get("/Entrada/getPaginated/:page", [jwt_config_1.verifyToken], (req, res) => this.controller.getEntradasPaginated(req, res));
        this.router.post("/Entrada/api/filtrar", [jwt_config_1.verifyToken], (req, res) => {
            console.log("Llamamos a response, request");
            this.controller.filtrarEntradas(req, res);
        });
        this.router.post("/Entrada/api/filtrarPaginate/:num/:page", [jwt_config_1.verifyToken], (req, res) => {
            console.log("Llamamos a response, request");
            this.controller.filtrarEntradasConPaginacion(req, res);
        });
        this.router.post("/Entrada/ordenar/all", [jwt_config_1.verifyToken], (req, res) => {
            console.log("Llamamos a response, request");
            this.controller.OrdenarEntradas(req, res);
        });
        this.router.get("/Entrada/Producto/:id_producto", [jwt_config_1.verifyToken], (req, res) => this.controller.EntradasbyProducto(req, res));
        this.router.get("/Entrada/vencimiento/:fecha", [jwt_config_1.verifyToken], (req, res) => this.controller.getEntradasPorVencimiento(req, res));
    }
}
exports.EntradaRouter = EntradaRouter;
