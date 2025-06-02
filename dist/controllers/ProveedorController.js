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
exports.ProveedorController = void 0;
const ProveedorService_1 = require("../services/ProveedorService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
class ProveedorController {
    constructor(proveedorService = new ProveedorService_1.ProveedorService()) {
        this.proveedorService = proveedorService;
    }
    createProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.proveedorService.createProveedor(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.proveedorService.findAllProveedores();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getProveedorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.proveedorService.findProveedorById(parseInt(ID));
                if (data)
                    res.status(200).json(data);
                else
                    res.status(404).json();
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    updateProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.proveedorService.updateProveedor(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.proveedorService.deleteProveedor(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    OrdenarProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof (ascendente));
                const data = (0, Ordenar_criterios_1.OrdenarProveedores)(ascendente, items, criterio);
                (data) ? res.status(200).json(data) : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    FiltrarProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { telefono, detalle_bancario, nombre, email } = req.body;
            try {
                console.log("telefono:" + telefono, "detalle_bancario:" + detalle_bancario, "nombre:" + nombre, "email:" + email);
                const data = yield this.proveedorService.filtrarProveedor(nombre, email, detalle_bancario, telefono);
                (data) ? res.status(200).json(data) : res.status(404).json("No se pudo filtrar");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.ProveedorController = ProveedorController;
