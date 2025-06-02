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
exports.ProveedorService = void 0;
const base_service_1 = require("../config/base.service");
const Proveedor_1 = require("../entities/Proveedor");
class ProveedorService extends base_service_1.BaseService {
    constructor() {
        super(Proveedor_1.Proveedor);
    }
    // servicio para obtener todos los Proveedors
    findAllProveedores() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find({ relations: ["entradas"] });
        });
    }
    findProveedorById(id_proveedor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("p")
                .leftJoinAndSelect("p.entradas", "e")
                .where("p.id_proveedor=:id_proveedor", { id_proveedor })
                .getOne();
        });
    }
    // servicio para crear un Proveedors
    createProveedor(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteProveedor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Proveedors
    updateProveedor(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarProveedor(nombre, email, detalle_bancario, telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            let proveedores = yield (yield this.execRepository).find();
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (nombre) {
                const normalizedNombre = normalizeString(nombre);
                proveedores = proveedores.filter((proveedor) => normalizeString(proveedor.nombre).includes(normalizedNombre));
            }
            if (email) {
                const normalizedEmail = normalizeString(email);
                proveedores = proveedores.filter((proveedor) => proveedor.email != null && normalizeString(proveedor.email).includes(normalizedEmail));
            }
            if (detalle_bancario != null) {
                const normalizedDetalleBancario = normalizeString(detalle_bancario);
                proveedores = proveedores.filter((proveedor) => proveedor.detalle_bancario != null && normalizeString(proveedor.detalle_bancario).includes(normalizedDetalleBancario));
            }
            if (telefono) {
                const normalizedTelefono = normalizeString(telefono);
                proveedores = proveedores.filter((proveedor) => proveedor.telefono != null && normalizeString(proveedor.telefono).includes(normalizedTelefono));
            }
            return proveedores;
        });
    }
}
exports.ProveedorService = ProveedorService;
