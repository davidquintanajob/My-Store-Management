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
exports.Venta = void 0;
const typeorm_1 = require("typeorm");
const Producto_1 = require("./Producto");
const Servicio_1 = require("./Servicio");
let Venta = class Venta extends typeorm_1.BaseEntity {
};
exports.Venta = Venta;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Venta.prototype, "id_producto", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Venta.prototype, "id_servicio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Venta.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Producto_1.Producto, (producto) => producto.id_producto, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_producto" }),
    __metadata("design:type", Producto_1.Producto)
], Venta.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Servicio_1.Servicio, (servicio) => servicio.venta, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_servicio" }),
    __metadata("design:type", Servicio_1.Servicio)
], Venta.prototype, "servicio", void 0);
exports.Venta = Venta = __decorate([
    (0, typeorm_1.Entity)()
], Venta);
