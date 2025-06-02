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
exports.Tienda = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Servicio_1 = require("./Servicio");
const Producto_1 = require("./Producto");
const Diario_1 = require("./Diario");
let Tienda = class Tienda extends typeorm_1.BaseEntity {
};
exports.Tienda = Tienda;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tienda.prototype, "id_tienda", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tienda.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tienda.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { default: 0 }),
    __metadata("design:type", Number)
], Tienda.prototype, "comicion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time", default: () => "CURRENT_TIME" }),
    __metadata("design:type", String)
], Tienda.prototype, "hora_apertura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time", default: () => "CURRENT_TIME" }),
    __metadata("design:type", String)
], Tienda.prototype, "hora_cierre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Usuario_1.Usuario, (usuario) => usuario.tienda),
    __metadata("design:type", Array)
], Tienda.prototype, "usuarios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Servicio_1.Servicio, (servicio) => servicio.tienda),
    __metadata("design:type", Array)
], Tienda.prototype, "servicios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Diario_1.Diario, (diario) => diario.tienda),
    (0, typeorm_1.JoinColumn)({ name: "id_tienda" }),
    __metadata("design:type", Array)
], Tienda.prototype, "diarios", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Producto_1.Producto, (producto) => producto.id_producto),
    (0, typeorm_1.JoinTable)({
        name: "Producto_tienda",
        joinColumn: {
            name: "id_tienda",
            referencedColumnName: "id_tienda",
        },
        inverseJoinColumn: {
            name: "id_producto",
            referencedColumnName: "id_producto",
        },
    }),
    __metadata("design:type", Array)
], Tienda.prototype, "producto", void 0);
exports.Tienda = Tienda = __decorate([
    (0, typeorm_1.Entity)()
], Tienda);
