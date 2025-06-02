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
exports.AccionController = void 0;
const AccionService_1 = require("../services/AccionService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
class AccionController {
    constructor(accionService = new AccionService_1.AccionService()) {
        this.accionService = accionService;
    }
    createAccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.accionService.createAccion(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getAccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.accionService.findAllAcciones();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getAccionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.accionService.findAccionById(parseInt(ID));
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
    updateAccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.accionService.updateAccion(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteAccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.accionService.deleteAccion(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    filtrarAccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_tipo_accion, nombre_usuario, descripcion, fecha_limsup, fecha_liminf } = req.body;
            try {
                const data = yield this.accionService.filtrarAccion(id_tipo_accion, descripcion, nombre_usuario, fecha_liminf, fecha_limsup);
                (data) ? res.status(200).json(data) : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    getAccionesPaginated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            try {
                const data = yield this.accionService.getAccionesPaginated(parseInt(page));
                (data) ? res.status(200).json(data) : res.status(404).json("Data not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    OrdenarAcciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof (ascendente));
                const data = (0, Ordenar_criterios_1.OrdenarAccion)(ascendente, items, criterio);
                (data) ? res.status(200).json(data) : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.AccionController = AccionController;
