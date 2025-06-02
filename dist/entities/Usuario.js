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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const Rol_1 = require("./Rol");
const Accion_1 = require("./Accion");
const Tienda_1 = require("./Tienda");
const Permiso_1 = require("./Permiso");
const Salida_1 = require("./Salida");
let Usuario = class Usuario extends typeorm_1.BaseEntity {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "contrasenna", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { default: 0 }),
    __metadata("design:type", Number)
], Usuario.prototype, "salario_CUP", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "carnet_identidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "detalles_bancarios", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Rol_1.Rol, (rol) => rol.id_rol),
    (0, typeorm_1.JoinColumn)({ name: "id_rol" }),
    __metadata("design:type", Rol_1.Rol)
], Usuario.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Accion_1.Accion, (accion) => accion.id_accion),
    __metadata("design:type", Array)
], Usuario.prototype, "acciones", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tienda_1.Tienda, (tienda) => tienda.usuarios),
    (0, typeorm_1.JoinColumn)({ name: "id_tienda" }),
    __metadata("design:type", Tienda_1.Tienda)
], Usuario.prototype, "tienda", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Salida_1.Salida, (salida) => salida.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "salidas", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Permiso_1.Permiso, (permiso) => permiso.id_permiso),
    (0, typeorm_1.JoinTable)({ name: "permiso_especial", joinColumn: {
            name: "id_usuario",
            referencedColumnName: "id_usuario"
        }, inverseJoinColumn: {
            name: "id_permiso",
            referencedColumnName: "id_permiso"
        } }),
    __metadata("design:type", Array)
], Usuario.prototype, "permisos_especiales", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)()
], Usuario);
