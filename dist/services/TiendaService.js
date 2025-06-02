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
exports.TiendaService = void 0;
const base_service_1 = require("../config/base.service");
const Tienda_1 = require("../entities/Tienda");
class TiendaService extends base_service_1.BaseService {
    constructor() {
        super(Tienda_1.Tienda);
    }
    // Tienda para obtener todos los Tiendas
    findAllTiendas() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findTiendaById(id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_tienda });
        });
    }
    // Tienda para crear un Tiendas
    createTienda(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteTienda(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Tiendas
    updateTienda(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    getServiciosbyTienda(id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id_tienda);
            return (yield this.execRepository)
                .createQueryBuilder("Tienda")
                .leftJoinAndSelect("Tienda.servicios", "servicio")
                .where("Tienda.id_tienda=:id_tienda", { id_tienda })
                .getMany();
        });
    }
    NoTiendasUsuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Tienda")
                .leftJoinAndSelect("Tienda.usuarios", "usuarios")
                .where("usuarios.id_usuario!=:id_usuario or usuarios.id_usuario ISNULL", { id_usuario })
                .getMany();
        });
    }
}
exports.TiendaService = TiendaService;
