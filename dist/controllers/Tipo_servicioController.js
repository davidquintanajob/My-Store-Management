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
exports.Tipo_servicioController = void 0;
const Tipo_servicioService_1 = require("../services/Tipo_servicioService");
class Tipo_servicioController {
    constructor(tipo_servicioService = new Tipo_servicioService_1.Tipo_servicioService()) {
        this.tipo_servicioService = tipo_servicioService;
    }
    createTipo_servicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.tipo_servicioService.createTipo_servicio(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getTipo_servicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.tipo_servicioService.findAllTipo_servicios();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getTipo_servicioById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.tipo_servicioService.findTipo_servicioById(parseInt(ID));
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
    updateTipo_servicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.tipo_servicioService.updateTipo_servicio(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteTipo_servicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.tipo_servicioService.deleteTipo_servicio(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    filtrarTipo_servicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, costo_liminf, costo_limsup } = req.body;
            try {
                const data = yield this.tipo_servicioService.filtrarTipo_servicio(nombre, costo_liminf, costo_limsup);
                (data) ? res.status(200).json(data) : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.Tipo_servicioController = Tipo_servicioController;
