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
exports.Deuda = void 0;
const typeorm_1 = require("typeorm");
const Pago_Deuda_1 = require("./Pago_Deuda");
const Servicio_1 = require("./Servicio");
let Deuda = class Deuda extends typeorm_1.BaseEntity {
};
exports.Deuda = Deuda;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Deuda.prototype, "id_deuda", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Deuda.prototype, "deuda", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Pago_Deuda_1.Pago_Deuda, (pago_deuda) => pago_deuda.deuda),
    __metadata("design:type", Array)
], Deuda.prototype, "pagos_deuda", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Servicio_1.Servicio, (servicio) => servicio.deuda),
    (0, typeorm_1.JoinColumn)({ name: "id_servicio" }),
    __metadata("design:type", Servicio_1.Servicio)
], Deuda.prototype, "servicio", void 0);
exports.Deuda = Deuda = __decorate([
    (0, typeorm_1.Entity)()
], Deuda);
