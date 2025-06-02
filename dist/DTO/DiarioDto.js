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
exports.DiarioDto = void 0;
// src/DTO/DiarioDto.ts
const class_validator_1 = require("class-validator");
const base_dto_1 = require("../config/base.dto");
class DiarioDto extends base_dto_1.BaseDTO {
}
exports.DiarioDto = DiarioDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DiarioDto.prototype, "id_diario", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], DiarioDto.prototype, "fecha_registro", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DiarioDto.prototype, "costo_total_salario_trabajadores", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DiarioDto.prototype, "costo_total_comicion_trabajadores", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DiarioDto.prototype, "costo_total_servicios", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DiarioDto.prototype, "otros_costos", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DiarioDto.prototype, "ganancia_total_servicios", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DiarioDto.prototype, "id_tienda", void 0);
