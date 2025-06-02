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
exports.Accion = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Tipo_accion_1 = require("./Tipo_accion");
let Accion = class Accion extends typeorm_1.BaseEntity {
};
exports.Accion = Accion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Accion.prototype, "id_accion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Accion.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date }),
    __metadata("design:type", Date)
], Accion.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.id_usuario),
    (0, typeorm_1.JoinColumn)({ name: "id_usuario" }),
    __metadata("design:type", Usuario_1.Usuario)
], Accion.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tipo_accion_1.Tipo_accion, (tipo_accion) => tipo_accion.id_tipo_accion),
    (0, typeorm_1.JoinColumn)({ name: "id_tipo_accion" }),
    __metadata("design:type", Tipo_accion_1.Tipo_accion)
], Accion.prototype, "tipo_accion", void 0);
exports.Accion = Accion = __decorate([
    (0, typeorm_1.Entity)()
], Accion);
