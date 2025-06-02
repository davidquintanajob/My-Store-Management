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
exports.AccionService = void 0;
const base_service_1 = require("../config/base.service");
const Accion_1 = require("../entities/Accion");
class AccionService extends base_service_1.BaseService {
    constructor() {
        super(Accion_1.Accion);
    }
    // servicio para obtener todos los Acciones
    findAllAcciones() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.execRepository)
                .createQueryBuilder("Accion")
                .leftJoinAndSelect("Accion.usuario", "u")
                .leftJoinAndSelect("Accion.tipo_accion", "ta")
                .getMany();
            //.find({relations:["tipo_accion","usuario"]});
        });
    }
    findAccionById(id_accion) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Accion")
                .leftJoinAndSelect("Accion.tipo_accion", "ta")
                .leftJoinAndSelect("Accion.usuario", "u")
                .where("Accion.id_accion=:id_accion", { id_accion })
                .getOne();
            //.findOneBy({ id_accion });
        });
    }
    // servicio para crear un Acciones
    createAccion(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteAccion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    getAccionesPaginated(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const limite = 20;
            const offset = (page - 1) * limite;
            const acciones = yield (yield this.execRepository)
                .createQueryBuilder("a")
                .leftJoinAndSelect("a.usuario", "u")
                .leftJoinAndSelect("a.tipo_accion", "ta")
                .take(limite)
                .skip(offset)
                .getMany();
            const cantidad_total_acciones = yield (yield this.execRepository)
                .createQueryBuilder("a")
                .getCount();
            return { "acciones": acciones, "pagina": page, "cantidad_total_acciones": cantidad_total_acciones };
        });
    }
    // actualizar un Acciones
    updateAccion(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarAccion(id_tipo_accion, descripcion, nombre_usuario, fecha_liminf, fecha_limsup) {
        return __awaiter(this, void 0, void 0, function* () {
            let acciones = [];
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (fecha_liminf && fecha_limsup == null) {
                acciones = yield (yield this.execRepository)
                    .createQueryBuilder("accion")
                    .leftJoinAndSelect("accion.tipo_accion", "ta")
                    .leftJoinAndSelect("accion.usuario", "u")
                    .where("accion.fecha>=:fecha_liminf", { fecha_liminf })
                    .getMany();
            }
            else if (fecha_limsup && fecha_liminf == null) {
                acciones = yield (yield this.execRepository)
                    .createQueryBuilder("accion")
                    .leftJoinAndSelect("accion.tipo_accion", "ta")
                    .leftJoinAndSelect("accion.usuario", "u")
                    .where("accion.fecha<=:fecha_limsup", { fecha_limsup })
                    .getMany();
            }
            else if (fecha_liminf && fecha_limsup) {
                acciones = yield (yield this.execRepository)
                    .createQueryBuilder("accion")
                    .leftJoinAndSelect("accion.tipo_accion", "ta")
                    .leftJoinAndSelect("accion.usuario", "u")
                    .where("accion.fecha<=:fecha_limsup and accion.fecha>=:fecha_liminf", { fecha_limsup, fecha_liminf })
                    .getMany();
            }
            else {
                acciones = yield (yield this.execRepository)
                    .createQueryBuilder("accion")
                    .leftJoinAndSelect("accion.tipo_accion", "ta")
                    .leftJoinAndSelect("accion.usuario", "u")
                    .getMany();
            }
            /* const normalizeDate=(fecha:string):Date=>{
             console.log(fecha)
             console.log(new Date(fecha))
             return (new Date(fecha));
             }*/
            if (id_tipo_accion) {
                acciones = acciones.filter((acc) => acc.tipo_accion.id_tipo_accion === id_tipo_accion);
            }
            if (descripcion) {
                const normalizedDescripcion = normalizeString(descripcion);
                acciones = acciones.filter((acc) => normalizeString(acc.descripcion).includes(normalizedDescripcion));
            }
            if (nombre_usuario) {
                const normalizedNombre_usuario = normalizeString(nombre_usuario);
                acciones = acciones.filter((acc) => normalizeString(acc.usuario.nombre_usuario).includes(normalizedNombre_usuario));
            }
            /* if(fecha_liminf){
                 acciones=acciones.filter((acc:Accion)=>acc.fecha>=normalizeDate(fecha_liminf))
             }
             if(fecha_limsup){
                 acciones=acciones.filter((acc:Accion)=>{
                     console.log(`${acc.fecha}<=${normalizeDate(fecha_limsup)}---->acc.fecha<=normalizeDate(fecha_limsup)`)
                     return acc.fecha<=normalizeDate(fecha_limsup)})
                 
             }*/
            return acciones;
        });
    }
}
exports.AccionService = AccionService;
