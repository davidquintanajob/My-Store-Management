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
exports.DeudaController = void 0;
const DeudaService_1 = require("../services/DeudaService");
class DeudaController {
    constructor(deudaService = new DeudaService_1.DeudaService()) {
        this.deudaService = deudaService;
    }
    createDeuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.deudaService.createDeuda(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getDeuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.deudaService.findAllDeudas();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getDeudaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.deudaService.findDeudaById(parseInt(ID));
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
    updateDeuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.deudaService.updateDeuda(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteDeuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.deudaService.deleteDeuda(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    filtrarDeuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_producto, nombre_cliente, fecha_liminf, fecha_limsup, deuda_liminf, deuda_limsup, saldada, id_tienda, id_tipo_servicio } = req.body;
            try {
                const data = yield this.deudaService.filtrarDeuda(nombre_producto, nombre_cliente, id_tienda, fecha_liminf, fecha_limsup, deuda_liminf, deuda_limsup, saldada, id_tipo_servicio);
                (data) ? res.status(200).json(data) : res.status(404).json("Not found");
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
}
exports.DeudaController = DeudaController;
