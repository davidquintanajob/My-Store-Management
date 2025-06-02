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
exports.Diario = void 0;
const typeorm_1 = require("typeorm");
const Tienda_1 = require("./Tienda");
const Servicio_1 = require("./Servicio");
let Diario = class Diario extends typeorm_1.BaseEntity {
};
exports.Diario = Diario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Diario.prototype, "id_diario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date }),
    __metadata("design:type", Date)
], Diario.prototype, "fecha_registro", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Diario.prototype, "costo_total_salario_trabajadores", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Diario.prototype, "costo_total_comicion_trabajadores", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Diario.prototype, "costo_total_servicios", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Diario.prototype, "otros_costos", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Diario.prototype, "ganancia_total_servicios", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tienda_1.Tienda, (tienda) => tienda.diarios),
    (0, typeorm_1.JoinColumn)({ name: "id_tienda" }),
    __metadata("design:type", Tienda_1.Tienda)
], Diario.prototype, "tienda", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Servicio_1.Servicio, (servicio) => servicio.diario),
    __metadata("design:type", Array)
], Diario.prototype, "servicios", void 0);
exports.Diario = Diario = __decorate([
    (0, typeorm_1.Entity)()
], Diario);
