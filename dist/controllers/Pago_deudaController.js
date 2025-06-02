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
exports.Pago_DeudaController = void 0;
const Pago_DeudaService_1 = require("../services/Pago_DeudaService");
class Pago_DeudaController {
    constructor(pago_DeudaService = new Pago_DeudaService_1.Pago_DeudaService()) {
        this.pago_DeudaService = pago_DeudaService;
    }
    createPago_Deuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.pago_DeudaService.createPago_Deuda(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getPago_Deuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.pago_DeudaService.findAllPago_Deuda();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getPago_DeudaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.pago_DeudaService.findPago_DeudaById(parseInt(ID));
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
    updatePago_Deuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.pago_DeudaService.updatePago_Deuda(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deletePago_Deuda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.pago_DeudaService.deletePago_Deuda(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
}
exports.Pago_DeudaController = Pago_DeudaController;
