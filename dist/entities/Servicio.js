"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servicio = void 0;
const typeorm_1 = require("typeorm");
const Tienda_1 = require("./Tienda");
const Tipo_servicio_1 = require("./Tipo_servicio");
const Garantia_1 = require("./Garantia");
const Deuda_1 = require("./Deuda");
const Encargo_1 = require("./Encargo");
const Cliente_1 = require("./Cliente");
const Venta_1 = require("./Venta");
const Diario_1 = require("./Diario");
let Servicio = class Servicio extends typeorm_1.BaseEntity {
};
exports.Servicio = Servicio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Servicio.prototype, "id_servicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date }),
    __metadata("design:type", Date)
], Servicio.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Servicio.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { default: 0 }),
    __metadata("design:type", Number)
], Servicio.prototype, "costo", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { default: 0 }),
    __metadata("design:type", Number)
], Servicio.prototype, "cantidad_transferida", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Servicio.prototype, "nota", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Servicio.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Servicio.prototype, "devuelto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tienda_1.Tienda, (tienda) => tienda.servicios),
    (0, typeorm_1.JoinColumn)({ name: "id_tienda" }),
    __metadata("design:type", Tienda_1.Tienda)
], Servicio.prototype, "tienda", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Diario_1.Diario, (diario) => diario.servicios, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_diario" }),
    __metadata("design:type", Object)
], Servicio.prototype, "diario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tipo_servicio_1.Tipo_servicio, (tipo_servicio) => tipo_servicio.id_tipo_servicio),
    (0, typeorm_1.JoinColumn)({ name: "id_tipo_servicio" }),
    __metadata("design:type", Tipo_servicio_1.Tipo_servicio)
], Servicio.prototype, "tipo_servicio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cliente_1.Cliente, (cliente) => cliente.servicios),
    (0, typeorm_1.JoinColumn)({ name: "id_cliente" }),
    __metadata("design:type", Cliente_1.Cliente)
], Servicio.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Garantia_1.Garantia, (garantia) => garantia.servicio),
    __metadata("design:type", Garantia_1.Garantia)
], Servicio.prototype, "garantia", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Deuda_1.Deuda, (deuda) => deuda.servicio),
    __metadata("design:type", Deuda_1.Deuda)
], Servicio.prototype, "deuda", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Venta_1.Venta, (venta) => venta.servicio),
    __metadata("design:type", Venta_1.Venta)
], Servicio.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Encargo_1.Encargo, (encargo) => encargo.servicio),
    __metadata("design:type", Encargo_1.Encargo)
], Servicio.prototype, "encargo", void 0);
exports.Servicio = Servicio = __decorate([
    (0, typeorm_1.Entity)()
], Servicio);
