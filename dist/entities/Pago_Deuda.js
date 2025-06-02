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
exports.Pago_Deuda = void 0;
const typeorm_1 = require("typeorm");
const Deuda_1 = require("./Deuda");
let Pago_Deuda = class Pago_Deuda extends typeorm_1.BaseEntity {
};
exports.Pago_Deuda = Pago_Deuda;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pago_Deuda.prototype, "id_pago_deuda", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Pago_Deuda.prototype, "pagada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date }),
    __metadata("design:type", Date)
], Pago_Deuda.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Deuda_1.Deuda, (deuda) => deuda.pagos_deuda),
    (0, typeorm_1.JoinColumn)({ name: "id_deuda" }),
    __metadata("design:type", Deuda_1.Deuda)
], Pago_Deuda.prototype, "deuda", void 0);
exports.Pago_Deuda = Pago_Deuda = __decorate([
    (0, typeorm_1.Entity)()
], Pago_Deuda);
