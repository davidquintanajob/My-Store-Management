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
exports.SalidaController = void 0;
const SalidaService_1 = require("../services/SalidaService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
class SalidaController {
    constructor(salidaService = new SalidaService_1.SalidaService()) {
        this.salidaService = salidaService;
    }
    createSalida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.salidaService.createSalida(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getSalida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.salidaService.findAllSalidas();
                res.status(200).json(data.map((salida) => {
                    return {
                        "id_salida": salida.id_salida,
                        "fecha": salida.fecha,
                        "cantidad": salida.cantidad,
                        "producto": salida.producto,
                        "tienda_destino": salida.tienda_destino,
                        "tienda_origen": salida.tienda_origen,
                        "usuario": {
                            "id_usuario": salida.usuario.id_usuario,
                            "nombre": salida.usuario.nombre,
                            "nombre_usuario": salida.usuario.nombre_usuario
                        }
                    };
                }));
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getSalidaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.salidaService.findSalidaById(parseInt(ID));
                if (data)
                    res.status(200).json({
                        "id_salida": data.id_salida,
                        "fecha": data.fecha,
                        "cantidad": data.cantidad,
                        "producto": data.producto,
                        "tienda_destino": data.tienda_destino,
                        "tienda_origen": data.tienda_origen,
                        "usuario": {
                            "id_usuario": data.usuario.id_usuario,
                            "nombre": data.usuario.nombre,
                            "nombre_usuario": data.usuario.nombre_usuario
                        }
                    });
                else
                    res.status(404).json();
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    updateSalida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.salidaService.updateSalida(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteSalida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.salidaService.deleteSalida(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    filtrarSalida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario, nombre_producto, cantidad, fecha_liminf, fecha_limsup, id_tienda_origen, id_tienda_destino } = req.body;
            try {
                const data = yield this.salidaService.filtrarSalida(nombre_usuario, nombre_producto, cantidad, fecha_liminf, fecha_limsup, id_tienda_origen, id_tienda_destino);
                (data) ? res.status(200).json(data.map((salida) => {
                    return {
                        "id_salida": salida.id_salida,
                        "fecha": salida.fecha,
                        "cantidad": salida.cantidad,
                        "producto": salida.producto,
                        "tienda_destino": salida.tienda_destino,
                        "tienda_origen": salida.tienda_origen,
                        "usuario": {
                            "id_usuario": salida.usuario.id_usuario,
                            "nombre": salida.usuario.nombre,
                            "nombre_usuario": salida.usuario.nombre_usuario
                        }
                    };
                })) : res.status(404).json({ "msg": "NOT FOUND" });
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    getSalidasPaginated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            try {
                const data = yield this.salidaService.getSalidasPaginated(parseInt(page));
                (data) ? res.status(200).json(data) : res.status(404).json("Data not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    OrdenarSalida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof (ascendente));
                const data = (0, Ordenar_criterios_1.OrdenarSalidas)(ascendente, items, criterio);
                (data) ? res.status(200).json(data) : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    filtrarSalidaJT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario, nombre_producto, cantidad, fecha_liminf, fecha_limsup, id_tienda, id_tienda_origen, id_tienda_destino } = req.body;
            try {
                const data = yield this.salidaService.filtrarSalidasJT(nombre_usuario, nombre_producto, cantidad, fecha_liminf, fecha_limsup, parseInt(id_tienda), id_tienda_origen, id_tienda_destino);
                (data) ? res.status(200).json(data.map((salida) => {
                    return {
                        "id_salida": salida.id_salida,
                        "fecha": salida.fecha,
                        "cantidad": salida.cantidad,
                        "producto": salida.producto,
                        "tienda_destino": salida.tienda_destino,
                        "tienda_origen": salida.tienda_origen,
                        "usuario": {
                            "id_usuario": salida.usuario.id_usuario,
                            "nombre": salida.usuario.nombre,
                            "nombre_usuario": salida.usuario.nombre_usuario
                        }
                    };
                })) : res.status(404).json({ "msg": "NOT FOUND" });
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.SalidaController = SalidaController;
