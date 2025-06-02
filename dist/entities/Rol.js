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
exports.Rol = void 0;
const typeorm_1 = require("typeorm");
const Permiso_1 = require("./Permiso");
let Rol = class Rol extends typeorm_1.BaseEntity {
};
exports.Rol = Rol;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Rol.prototype, "id_rol", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Rol.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Permiso_1.Permiso, (permiso) => permiso.id_permiso, { cascade: true }),
    (0, typeorm_1.JoinTable)({ name: "Rol_permiso", joinColumn: {
            name: "id_rol",
            referencedColumnName: "id_rol"
        }, inverseJoinColumn: {
            name: "id_permiso",
            referencedColumnName: "id_permiso"
        } }),
    __metadata("design:type", Array)
], Rol.prototype, "permisos", void 0);
exports.Rol = Rol = __decorate([
    (0, typeorm_1.Entity)()
], Rol);
