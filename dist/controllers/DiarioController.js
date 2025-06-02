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
exports.DiarioController = void 0;
const DiarioService_1 = require("../services/DiarioService");
class DiarioController {
    constructor(diarioService = new DiarioService_1.DiarioService()) {
        this.diarioService = diarioService;
    }
    createDiario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.diarioService.createDiario(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getDiario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.diarioService.findAllDiaros();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getDiarioById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.diarioService.findDiarioById(parseInt(ID));
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
    updateDiario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.diarioService.updateDiario(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    deleteDiario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.diarioService.deleteDiario(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
}
exports.DiarioController = DiarioController;
