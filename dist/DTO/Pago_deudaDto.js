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
exports.Pago_DeudaDto = void 0;
const class_validator_1 = require("class-validator");
const base_dto_1 = require("../config/base.dto");
class Pago_DeudaDto extends base_dto_1.BaseDTO {
}
exports.Pago_DeudaDto = Pago_DeudaDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Pago_DeudaDto.prototype, "id_pago_deuda", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Pago_DeudaDto.prototype, "pagada", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Pago_DeudaDto.prototype, "fecha", void 0);
