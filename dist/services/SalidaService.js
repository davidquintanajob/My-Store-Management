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
exports.SalidaService = void 0;
const base_service_1 = require("../config/base.service");
const Salida_1 = require("../entities/Salida");
class SalidaService extends base_service_1.BaseService {
    constructor() {
        super(Salida_1.Salida);
    }
    // Salida para obtener todos los Salidas
    findAllSalidas() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find({
                relations: ["producto", "tienda_origen", "tienda_destino", "usuario"],
            });
        });
    }
    findSalidaById(id_salida) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("salida")
                .leftJoinAndSelect("salida.tienda_origen", "to")
                .leftJoinAndSelect("salida.tienda_destino", "td")
                .leftJoinAndSelect("salida.usuario", "u")
                .leftJoinAndSelect("salida.producto", "p")
                .where("salida.id_salida=:id_salida", { id_salida })
                .getOne();
            //.findOneBy({ id_salida });
        });
    }
    // Salida para crear un Salidas
    createSalida(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    getSalidasPaginated(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const limite = 20;
            const offset = (page - 1) * limite;
            const salidas = yield (yield this.execRepository)
                .createQueryBuilder("s")
                .leftJoinAndSelect("s.producto", "p")
                .leftJoinAndSelect("s.tienda_origen", "to")
                .leftJoinAndSelect("s.tienda_destino", "td")
                .leftJoinAndSelect("s.usuario", "u")
                .take(limite)
                .skip(offset)
                .getMany();
            const cantidad_total_salidas = yield (yield this.execRepository)
                .createQueryBuilder("s")
                .getCount();
            return {
                salidas: salidas,
                pagina: page,
                cantidad_total_salidas: cantidad_total_salidas,
            };
        });
    }
    deleteSalida(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Salidas
    updateSalida(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarSalida(nombre_usuario, nombre_producto, cantidad, fechaliminf, fechalimsup, id_tienda_origen, id_tienda_destino) {
        return __awaiter(this, void 0, void 0, function* () {
            let salidas = [];
            const normalizeString = (str) => str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            console.log(nombre_usuario, nombre_producto, cantidad, fechaliminf, fechalimsup, id_tienda_origen, id_tienda_destino);
            if (fechaliminf && fechalimsup) {
                salidas = yield (yield this.execRepository)
                    .createQueryBuilder("salida")
                    .leftJoinAndSelect("salida.tienda_origen", "to")
                    .leftJoinAndSelect("salida.tienda_destino", "td")
                    .leftJoinAndSelect("salida.usuario", "u")
                    .leftJoinAndSelect("salida.producto", "p")
                    .where("salida.fecha>=:fechaliminf and salida.fecha<=:fechalimsup", {
                    fechaliminf,
                    fechalimsup,
                })
                    .getMany();
                console.log(salidas);
            }
            else if (fechaliminf) {
                salidas = yield (yield this.execRepository)
                    .createQueryBuilder("salida")
                    .leftJoinAndSelect("salida.tienda_origen", "to")
                    .leftJoinAndSelect("salida.tienda_destino", "td")
                    .leftJoinAndSelect("salida.usuario", "u")
                    .leftJoinAndSelect("salida.producto", "p")
                    .where("salida.fecha>=:fechaliminf", { fechaliminf })
                    .getMany();
            }
            else if (fechalimsup) {
                salidas = yield (yield this.execRepository)
                    .createQueryBuilder("salida")
                    .leftJoinAndSelect("salida.tienda_origen", "to")
                    .leftJoinAndSelect("salida.tienda_destino", "td")
                    .leftJoinAndSelect("salida.usuario", "u")
                    .leftJoinAndSelect("salida.producto", "p")
                    .where("salida.fecha<=:fechalimsup", { fechalimsup })
                    .getMany();
            }
            else {
                salidas = yield (yield this.execRepository).find({
                    relations: ["producto", "tienda_origen", "tienda_destino", "usuario"],
                });
            }
            if (nombre_usuario) {
                const normalizednombre_usuario = normalizeString(nombre_usuario);
                salidas = salidas.filter((salida) => normalizeString(salida.usuario.nombre).includes(normalizednombre_usuario));
            }
            if (nombre_producto) {
                const normalizedNombre_producto = normalizeString(nombre_producto);
                salidas = salidas.filter((salida) => normalizeString(salida.producto.nombre).includes(normalizedNombre_producto));
            }
            if (cantidad)
                salidas = salidas.filter((salida) => salida.cantidad === cantidad);
            if (id_tienda_origen) {
                const auxiliar = [];
                salidas.forEach((salida) => {
                    if (salida.tienda_origen.id_tienda === id_tienda_origen)
                        auxiliar.push(salida);
                });
                salidas = auxiliar;
            }
            if (id_tienda_destino) {
                const auxiliar = [];
                salidas.forEach((salida) => {
                    if (salida.tienda_destino.id_tienda === id_tienda_destino)
                        auxiliar.push(salida);
                });
                salidas = auxiliar;
            }
            return salidas;
        });
    }
    filtrarSalidasJT(nombre_usuario, nombre_producto, cantidad, fechaliminf, fechalimsup, id_tienda, id_tienda_origen, id_tienda_destino) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizeString = (str) => str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            let salidas = [];
            /*  let  salidas:Salida[]=await(await this.execRepository)
                .createQueryBuilder("salida")
                .leftJoinAndSelect("salida.tienda_origen","to")
                .leftJoinAndSelect("salida.tienda_destino","td")
                .leftJoinAndSelect("salida.usuario","u")
                .leftJoinAndSelect("salida.producto","p")
                .where("to.id_tienda=:id_tienda or td.id_tienda=:id_tienda",{id_tienda})
                .getMany();*/
            const normalizeDate = (fecha) => {
                return new Date(fecha);
            };
            if (fechaliminf && fechalimsup) {
                salidas = yield (yield this.execRepository)
                    .createQueryBuilder("salida")
                    .leftJoinAndSelect("salida.tienda_origen", "to")
                    .leftJoinAndSelect("salida.tienda_destino", "td")
                    .leftJoinAndSelect("salida.usuario", "u")
                    .leftJoinAndSelect("salida.producto", "p")
                    .where("salida.fecha>=:fechaliminf and salida.fecha<=:fechalimsup and (to.id_tienda=:id_tienda or td.id_tienda=:id_tienda)", { fechaliminf, fechalimsup, id_tienda })
                    .getMany();
                console.log(salidas);
            }
            else if (fechaliminf != null && fechalimsup == null) {
                salidas = yield (yield this.execRepository)
                    .createQueryBuilder("salida")
                    .leftJoinAndSelect("salida.tienda_origen", "to")
                    .leftJoinAndSelect("salida.tienda_destino", "td")
                    .leftJoinAndSelect("salida.usuario", "u")
                    .leftJoinAndSelect("salida.producto", "p")
                    .where("salida.fecha>=:fechaliminf and (to.id_tienda=:id_tienda or td.id_tienda=:id_tienda)", { fechaliminf, id_tienda })
                    .getMany();
            }
            else if (fechalimsup != null && fechaliminf == null) {
                salidas = yield (yield this.execRepository)
                    .createQueryBuilder("salida")
                    .leftJoinAndSelect("salida.tienda_origen", "to")
                    .leftJoinAndSelect("salida.tienda_destino", "td")
                    .leftJoinAndSelect("salida.usuario", "u")
                    .leftJoinAndSelect("salida.producto", "p")
                    .where("salida.fecha<=:fechalimsup and(to.id_tienda=:id_tienda or td.id_tienda=:id_tienda)", { fechalimsup, id_tienda })
                    .getMany();
            }
            else {
                salidas = yield (yield this.execRepository)
                    .createQueryBuilder("salida")
                    .leftJoinAndSelect("salida.tienda_origen", "to")
                    .leftJoinAndSelect("salida.tienda_destino", "td")
                    .leftJoinAndSelect("salida.usuario", "u")
                    .leftJoinAndSelect("salida.producto", "p")
                    .where("to.id_tienda=:id_tienda or td.id_tienda=:id_tienda", {
                    id_tienda,
                })
                    .getMany();
            }
            console.log("-->" + salidas[0].fecha);
            if (nombre_usuario) {
                console.log("usuario-->" + salidas[0].fecha);
                const normalizednombre_usuario = normalizeString(nombre_usuario);
                salidas = salidas.filter((salida) => normalizeString(salida.usuario.nombre_usuario).includes(normalizednombre_usuario));
            }
            if (nombre_producto) {
                console.log("usuario-->" + salidas[0].fecha);
                const normalizedNombre_producto = normalizeString(nombre_producto);
                salidas = salidas.filter((salida) => normalizeString(salida.producto.nombre).includes(normalizedNombre_producto));
            }
            if (cantidad) {
                salidas = salidas.filter((salida) => salida.cantidad === cantidad);
            }
            /*if(fechaliminf){
                    console.log(salidas)
                salidas=salidas.filter((salida:Salida)=>salida.fecha.getTime()>=normalizeDate(fechaliminf).getTime())
        
                }
                if(fechalimsup){
        
                    salidas=salidas.filter((salida:Salida)=>salida.fecha.getTime()<=normalizeDate(fechalimsup).getTime())
                }*/
            if (id_tienda_origen) {
                salidas = salidas.filter((salida) => salida.tienda_origen.id_tienda == id_tienda_origen);
            }
            if (id_tienda_destino) {
                salidas = salidas.filter((salida) => salida.tienda_destino.id_tienda == id_tienda_destino);
            }
            return salidas;
        });
    }
}
exports.SalidaService = SalidaService;
