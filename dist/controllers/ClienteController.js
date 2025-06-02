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
exports.ClienteController = void 0;
const ClienteService_1 = require("../services/ClienteService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
class ClienteController {
    constructor(clienteService = new ClienteService_1.ClienteService()) {
        this.clienteService = clienteService;
    }
    createCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.clienteService.createCliente(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.clienteService.findAllClientees();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getClienteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.clienteService.findClienteById(parseInt(ID));
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
    updateCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.clienteService.updateCliente(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.clienteService.deleteCliente(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    filtrarCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, telefono, detalles_bancarios, cif } = req.body;
            try {
                const data = yield this.clienteService.filtrarCliente(nombre, cif, telefono, detalles_bancarios);
                (data) ? res.status(200).json(data) : res.status(404).json("Not found");
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    OrdenarCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof (ascendente));
                const data = (0, Ordenar_criterios_1.OrdenarClientes)(ascendente, items, criterio);
                (data) ? res.status(200).json(data) : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.ClienteController = ClienteController;
