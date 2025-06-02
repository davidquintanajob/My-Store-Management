"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto_tiendaController = void 0;
const Producto_tiendaService_1 = require("../services/Producto_tiendaService");
class Producto_tiendaController {
    constructor(producto_tiendaService = new Producto_tiendaService_1.Producto_tiendaService()) {
        this.producto_tiendaService = producto_tiendaService;
    }
    createProducto_tienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.producto_tiendaService.createProducto_tienda(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getProducto_tienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.producto_tiendaService.findAllProducto_tienda();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getProducto_tiendaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto, id_tienda } = req.params;
            try {
                const data = yield this.producto_tiendaService.findProducto_tiendaById(parseInt(id_producto), parseInt(id_tienda));
                if (data)
                    res.status(200).json({
                        "cantidad": data.cantidad,
                        "encontrado": true
                    });
                else
                    res.status(404).json({
                        "encontrado": false
                    });
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    updateProducto_tienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto, id_tienda } = req.body;
            try {
                const data = yield this.producto_tiendaService.updateProducto_tienda(parseInt(id_producto), parseInt(id_tienda), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteProducto_tienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto, id_tienda } = req.body;
            try {
                const data = yield this.producto_tiendaService.deleteProducto_tienda(parseInt(id_producto), parseInt(id_tienda));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getProductosbyTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_tienda } = req.params;
            try {
                const data = yield this.producto_tiendaService.getProductosTienda(parseInt(id_tienda));
                (data.length > 0) ? res.status(200).json(data) : res.status(404).json("Tienda no encontrada");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    getTiendabyProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto } = req.params;
            try {
                const data = yield this.producto_tiendaService.getTiendasbyProducto(parseInt(id_producto));
                (data) ? res.status(200).json(data) : res.status(404).json("Producto no encontrado");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    moverProducto_tienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_producto, id_tienda_origen, id_tienda_destino, cantidad } = req.body;
                console.log(id_producto, id_tienda_origen, id_tienda_destino, cantidad);
                yield this.producto_tiendaService.moverProducto(parseInt(id_producto), parseInt(id_tienda_origen), parseInt(id_tienda_destino), parseInt(cantidad));
                res.status(200).json(true);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getCantidadTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto } = req.params;
            try {
                const data = yield this.producto_tiendaService.cantidadTotalProductos(parseInt(id_producto));
                res.status(200).json({ "cantidad_total": data });
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    realizarVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto, id_tienda, cantidad } = req.body;
            try {
                const data = yield this.producto_tiendaService.realizarVenta(parseInt(id_producto), parseInt(id_tienda), parseInt(cantidad));
                if (data) {
                    res.status(200).json({
                        "cantidad": cantidad,
                        "Producto_tienda": data
                    });
                }
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    filtrarPorCantidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cantidad } = req.params;
            try {
                const data = yield this.producto_tiendaService.filtrarPorCantidad(parseInt(cantidad));
                (data) ? res.status(200).json(data) : res.status(404).json();
            }
            catch (error) {
                res.status(500).json({ "error": error });
            }
        });
    }
    HacerEntrada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto, id_tienda, cantidad } = req.body;
            try {
                const data = yield this.producto_tiendaService.HacerEntrada(parseInt(id_tienda), parseInt(id_producto), parseInt(cantidad));
                (data) ? res.status(200).json(data) : res.status(404).json("No encontrado");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    deleteProducto_tiendain0(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.producto_tiendaService.deleteProducto_tiendain0();
                (data) ? res.status(200).json(true) : res.status(404).json("Explotó");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    filtrarProducto_tienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, sku, precio_liminf, precio_limsup, id_tienda, cantidad } = req.body;
            try {
                const data = yield this.producto_tiendaService.filtrarProducto_tienda(nombre, sku, precio_liminf, precio_limsup, parseInt(id_tienda), cantidad);
                (data) ? res.status(200).json(data) : res.status(404).json("No se encontró el elemento");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    ImportarExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path } = req.body;
            try {
                const data = yield this.producto_tiendaService.Producto_tiendaToExcel(path);
                res.status(200).json(data);
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
            ;
        });
    }
}
exports.Producto_tiendaController = Producto_tiendaController;
