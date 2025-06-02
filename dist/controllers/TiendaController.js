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
exports.TiendaController = void 0;
const TiendaService_1 = require("../services/TiendaService");
class TiendaController {
    constructor(tiendaService = new TiendaService_1.TiendaService()) {
        this.tiendaService = tiendaService;
    }
    createTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.tiendaService.createTienda(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.tiendaService.findAllTiendas();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getTiendaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.tiendaService.findTiendaById(parseInt(ID));
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
    updateTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.tiendaService.updateTienda(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.tiendaService.deleteTienda(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    ServiciosbyTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_tienda } = req.params;
            try {
                const data = yield this.tiendaService.getServiciosbyTienda(parseInt(id_tienda));
                (data) ? res.status(200).json(data) : res.status(404).json("Tienda no encontrada");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    NoTiendasUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                console.log(id_usuario);
                const data = yield this.tiendaService.NoTiendasUsuario(parseInt(id_usuario));
                (data) ? res.status(200).json(data) : res.status(404).json("Usuario no encontrado");
            }
            catch (error) {
                res.status(500).json(error.message);
            }
        });
    }
}
exports.TiendaController = TiendaController;
