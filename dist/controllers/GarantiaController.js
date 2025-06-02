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
exports.GarantiaController = void 0;
const GarantiaService_1 = require("../services/GarantiaService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
class GarantiaController {
    constructor(garantiaService = new GarantiaService_1.GarantiaService()) {
        this.garantiaService = garantiaService;
    }
    createGarantia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.garantiaService.createGarantia(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getGarantia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.garantiaService.findAllGarantia();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getGarantiaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.garantiaService.findGarantiaById(parseInt(ID));
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
    updateGarantia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.garantiaService.updateGarantia(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteGarantia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.garantiaService.deleteGarantia(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    filtrarGarantia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_cliente, fecha_liminf, fecha_limsup, duracion_limsup, duracion_liminf, nombre_producto, id_tienda } = req.body;
            try {
                const data = yield this.garantiaService.filtrarGarantias(nombre_cliente, fecha_liminf, fecha_limsup, nombre_producto, duracion_liminf, duracion_limsup, id_tienda);
                (data) ? res.status(200).json(data) : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    OrdenarGarantia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof (ascendente));
                const data = (0, Ordenar_criterios_1.OrdenarGarantias)(ascendente, items, criterio);
                (data) ? res.status(200).json(data) : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.GarantiaController = GarantiaController;
