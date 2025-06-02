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
exports.Rol_permiso = void 0;
const typeorm_1 = require("typeorm");
const Rol_1 = require("./Rol");
const Permiso_1 = require("./Permiso");
let Rol_permiso = class Rol_permiso extends typeorm_1.BaseEntity {
};
exports.Rol_permiso = Rol_permiso;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Rol_permiso.prototype, "id_permiso", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Rol_permiso.prototype, "id_rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Rol_permiso.prototype, "tiene", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Rol_1.Rol, (rol) => rol.id_rol, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_rol" }),
    __metadata("design:type", Rol_1.Rol)
], Rol_permiso.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Permiso_1.Permiso, (permiso) => permiso.id_permiso, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_permiso" }),
    __metadata("design:type", Permiso_1.Permiso)
], Rol_permiso.prototype, "permiso", void 0);
exports.Rol_permiso = Rol_permiso = __decorate([
    (0, typeorm_1.Entity)()
], Rol_permiso);
