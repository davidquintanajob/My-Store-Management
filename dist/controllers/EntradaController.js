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
exports.EntradaController = void 0;
const EntradaService_1 = require("../services/EntradaService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
class EntradaController {
    constructor(entradaService = new EntradaService_1.EntradaService()) {
        this.entradaService = entradaService;
    }
    createEntrada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.entradaService.createEntrada(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                console.log(e.message);
                res.status(500).json({ error: e.message });
            }
        });
    }
    getEntrada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.entradaService.findAllEntradas();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getEntradaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.entradaService.findEntradaById(parseInt(ID));
                if (data)
                    res.status(200).json(data);
                else
                    res.status(404).json();
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    updateEntrada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.entradaService.updateEntrada(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    deleteEntrada(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.entradaService.deleteEntrada(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getAllEntradasbyProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proveedor } = req.params;
            try {
                console.log(id_proveedor);
                const data = yield this.entradaService.getAllEntradasbyProveedor(parseInt(id_proveedor));
                data ? res.status(200).json(data) : res.status(404).json("No encontrado");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getEntradasPaginated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            try {
                const data = yield this.entradaService.getEntradasPaginated(parseInt(page));
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("Data not found");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    filtrarEntradasConPaginacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { num, page } = req.params;
            const { nombre_proveedor, nombre_producto, costo_liminf, costo_limsup, fecha_liminf, fecha_limsup, } = req.body;
            try {
                const data = yield this.entradaService.filtrarEntradasConPaginacion(nombre_proveedor, nombre_producto, costo_liminf, costo_limsup, fecha_liminf, fecha_limsup, parseInt(num), parseInt(page));
                const totalElements = yield this.entradaService.filtrarEntradas(nombre_proveedor, nombre_producto, costo_liminf, costo_limsup, fecha_liminf, fecha_limsup);
                const response = {
                    entradas: data,
                    pagina: parseInt(page),
                    totalElements: totalElements.length,
                };
                res.status(200).json(response);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    filtrarEntradas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_proveedor, nombre_producto, costo_liminf, costo_limsup, fecha_liminf, fecha_limsup, } = req.body;
            try {
                const data = yield this.entradaService.filtrarEntradas(nombre_proveedor, nombre_producto, costo_liminf, costo_limsup, fecha_liminf, fecha_limsup);
                data ? res.status(200).json(data) : res.status(404).json("No encontrado");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    OrdenarEntradas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof ascendente);
                const data = (0, Ordenar_criterios_1.OrdenarEntradas)(ascendente, items, criterio);
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    EntradasbyProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto } = req.params;
            try {
                const data = yield this.entradaService.EntradasbyProducto(parseInt(id_producto));
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("Producto no encontrado");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getEntradasPorVencimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha } = req.params;
            try {
                const data = yield this.entradaService.getEntradasPorVencimiento(fecha);
                data ? res.status(200).json(data) : res.status(404).json("No encontrado");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.EntradaController = EntradaController;
