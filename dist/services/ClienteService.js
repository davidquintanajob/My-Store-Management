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
exports.ClienteService = void 0;
const base_service_1 = require("../config/base.service");
const Cliente_1 = require("../entities/Cliente");
class ClienteService extends base_service_1.BaseService {
    constructor() {
        super(Cliente_1.Cliente);
    }
    // servicio para obtener todos los Clientes
    findAllClientees() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findClienteById(id_cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_cliente });
        });
    }
    // servicio para crear un Clientes
    createCliente(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteCliente(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Clientes
    updateCliente(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarCliente(nombre, cif, telefono, detalles_bancarios) {
        return __awaiter(this, void 0, void 0, function* () {
            let clientes = yield (yield this.execRepository)
                .createQueryBuilder("Cliente")
                .getMany();
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (nombre) {
                const normalizedNombre = normalizeString(nombre);
                clientes = clientes.filter((cliente) => normalizeString(cliente.nombre).includes(normalizedNombre));
            }
            if (cif) {
                const normalizedcif = normalizeString(cif);
                clientes = clientes.filter((cliente) => normalizeString(cliente.Cif).includes(normalizedcif));
            }
            if (telefono) {
                const normalizedNombre = normalizeString(telefono);
                clientes = clientes.filter((cliente) => normalizeString(cliente.telefono).includes(normalizedNombre));
            }
            if (detalles_bancarios) {
                const normalizedNombre = normalizeString(detalles_bancarios);
                clientes = clientes.filter((cliente) => normalizeString(cliente.detalles_bancarios).includes(normalizedNombre));
            }
            return clientes;
        });
    }
}
exports.ClienteService = ClienteService;
