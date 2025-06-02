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
exports.Garantia = void 0;
const typeorm_1 = require("typeorm");
const Servicio_1 = require("./Servicio");
let Garantia = class Garantia extends typeorm_1.BaseEntity {
};
exports.Garantia = Garantia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Garantia.prototype, "id_garantia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Garantia.prototype, "duracion", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Servicio_1.Servicio, (servicio) => servicio.garantia),
    (0, typeorm_1.JoinColumn)({ name: "id_servicio" }),
    __metadata("design:type", Servicio_1.Servicio)
], Garantia.prototype, "servicio", void 0);
exports.Garantia = Garantia = __decorate([
    (0, typeorm_1.Entity)()
], Garantia);
