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
exports.Salida = void 0;
const typeorm_1 = require("typeorm");
const Tienda_1 = require("./Tienda");
const Usuario_1 = require("./Usuario");
const Producto_1 = require("./Producto");
let Salida = class Salida extends typeorm_1.BaseEntity {
};
exports.Salida = Salida;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Salida.prototype, "id_salida", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date }),
    __metadata("design:type", Date)
], Salida.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Salida.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Producto_1.Producto, (producto) => producto.id_producto),
    (0, typeorm_1.JoinColumn)({ name: "id_producto" }),
    __metadata("design:type", Producto_1.Producto)
], Salida.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tienda_1.Tienda, (tienda) => tienda.id_tienda),
    (0, typeorm_1.JoinColumn)({ name: "id_tienda_origen" }),
    __metadata("design:type", Tienda_1.Tienda)
], Salida.prototype, "tienda_origen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tienda_1.Tienda, (tienda) => tienda.id_tienda),
    (0, typeorm_1.JoinColumn)({ name: "id_tienda_destino" }),
    __metadata("design:type", Tienda_1.Tienda)
], Salida.prototype, "tienda_destino", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.salidas),
    (0, typeorm_1.JoinColumn)({ name: "id_usuario" }),
    __metadata("design:type", Usuario_1.Usuario)
], Salida.prototype, "usuario", void 0);
exports.Salida = Salida = __decorate([
    (0, typeorm_1.Entity)()
], Salida);
