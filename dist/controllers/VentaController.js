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
exports.VentaController = void 0;
const VentaService_1 = require("../services/VentaService");
class VentaController {
    constructor(ventaService = new VentaService_1.VentaService()) {
        this.ventaService = ventaService;
    }
    createVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ventaService.createVenta(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ventaService.findAllVentas();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getVentaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto, id_servicio } = req.params;
            try {
                const data = yield this.ventaService.findVentaById(parseInt(id_producto), parseInt(id_servicio));
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
    updateVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_servicio, id_producto } = req.body;
            try {
                const data = yield this.ventaService.updateVenta(parseInt(id_producto), parseInt(id_servicio), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto, id_servicio } = req.params;
            try {
                const data = yield this.ventaService.deleteVenta(parseInt(id_producto), parseInt(id_servicio));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    listaVendidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.ventaService.Producto_masVendido();
                (data) ? res.status(200).json(data) : res.status(404).json("No productos");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    listaVendidosPorFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fecha_liminf, fecha_limsup } = req.body;
            try {
                const data = yield this.ventaService.Producto_masVendidoEntreRangosDeFecha(new Date(fecha_liminf), new Date(fecha_limsup));
                (data) ? res.status(200).json(data) : res.status(404).json("No se encontraron");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    findVentabyId_producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_producto } = req.params;
            try {
                const data = yield this.ventaService.findbyId_producto(parseInt(id_producto));
                (data) ? res.status(200).json(data) : res.status(404).json("NOT FOUND");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    findVentabyId_servicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_servicio } = req.params;
            try {
                const data = yield this.ventaService.findbyId_servicio(parseInt(id_servicio));
                (data) ? res.status(200).json(data) : res.status(404).json("NOT FOUND");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.VentaController = VentaController;
