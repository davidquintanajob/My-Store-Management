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
exports.Producto = void 0;
const typeorm_1 = require("typeorm");
const Imagen_1 = require("./Imagen");
const Tienda_1 = require("./Tienda");
const Venta_1 = require("./Venta");
let Producto = class Producto extends typeorm_1.BaseEntity {
};
exports.Producto = Producto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Producto.prototype, "id_producto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Producto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Producto.prototype, "Sku", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Producto.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)("float"),
    __metadata("design:type", Number)
], Producto.prototype, "precio_empresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.0 }),
    __metadata("design:type", Number)
], Producto.prototype, "costo_acumulado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Producto.prototype, "isFecha_Vencimiento", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Imagen_1.Imagen, (imagen) => imagen.producto),
    __metadata("design:type", Array)
], Producto.prototype, "imagenes", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Tienda_1.Tienda, { cascade: true }),
    (0, typeorm_1.JoinTable)({ name: "Producto_tienda", joinColumn: {
            name: "id_producto",
            referencedColumnName: "id_producto"
        }, inverseJoinColumn: {
            name: "id_tienda",
            referencedColumnName: "id_tienda"
        } }),
    __metadata("design:type", Array)
], Producto.prototype, "tiendas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Venta_1.Venta, (venta) => venta, { cascade: true }),
    __metadata("design:type", Array)
], Producto.prototype, "ventas", void 0);
exports.Producto = Producto = __decorate([
    (0, typeorm_1.Entity)()
], Producto);
