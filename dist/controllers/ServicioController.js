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
exports.ServicioController = void 0;
const ServicioService_1 = require("../services/ServicioService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
class ServicioController {
    constructor(servicioService = new ServicioService_1.ServicioService()) {
        this.servicioService = servicioService;
    }
    createServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.servicioService.createServicio(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.servicioService.findAllServicios();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getServicioById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.servicioService.findServicioById(parseInt(ID));
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
    updateServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.servicioService.updateServicio(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.servicioService.deleteServicio(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getAllGanancia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ganancia = yield this.servicioService.GananciaTotalServicio();
                res.status(200).json({ "ganancia_total": ganancia });
            }
            catch (e) {
                res.status(500).json({ "error": e });
            }
        });
    }
    getServiciosPaginated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            try {
                const data = yield this.servicioService.getServiciosPaginated(parseInt(page));
                (data) ? res.status(200).json(data) : res.status(404).json("Data not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    getServiciosPorTipo_servicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_tipo_servicio } = req.params;
            try {
                const data = yield this.servicioService.getServiciosbyTipo_servicio(parseInt(id_tipo_servicio));
                (data) ? res.status(200).json(data) : res.status(404).json("Tipo servicio no encontrado");
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    OrdenarServicios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof (ascendente));
                const data = yield (0, Ordenar_criterios_1.OrdenarServicio)(ascendente, items, criterio);
                (data) ? res.status(200).json(data) : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    filtrarServicios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_cliente, id_tipo_servicio, id_tienda, precio_liminf, precio_limsup, fecha_liminf, fecha_limsup, nombre_producto } = req.body;
            try {
                const data = yield this.servicioService.filtrarServicio(nombre_cliente, precio_liminf, precio_limsup, fecha_liminf, fecha_limsup, id_tipo_servicio, id_tienda, nombre_producto);
                (data) ? res.status(200).json(data) : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
    filtrarServiciosJT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_cliente, id_tipo_servicio, id_tienda, precio_liminf, precio_limsup, fecha_liminf, fecha_limsup } = req.body;
            try {
                const data = yield this.servicioService.filtrarServicioJT(nombre_cliente, precio_liminf, precio_limsup, fecha_liminf, fecha_limsup, parseInt(id_tipo_servicio), id_tienda);
                (data) ? res.status(200).json(data) : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.ServicioController = ServicioController;
