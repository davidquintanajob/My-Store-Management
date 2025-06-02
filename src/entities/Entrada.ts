import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from "./Proveedor";
import { Producto } from "./Producto";
import { Tienda } from "./Tienda";

@Entity()
export class Entrada extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_entrada!:number

    @Column("float")
    costo!:number

    @Column("float",{ default: 0.00 })
    costo_cup!:number

    @Column()
    cantidad!:number

    @Column({type:Date})
    fecha!:Date;

    @Column({nullable:true})
    fecha_vencimiento!:Date

    @ManyToOne(()=>Proveedor, (proveedor:Proveedor)=>proveedor.entradas)
    @JoinColumn({name:"id_proveedor"})
    proveedor!:Proveedor

    @ManyToOne(()=>Producto,(producto:Producto)=>producto.id_producto)
    @JoinColumn({name:"id_producto"})
    producto!:Producto

    @ManyToOne(()=>Tienda,(tienda:Tienda)=>tienda.id_tienda)
    @JoinColumn({name:"id_tienda"})
    tienda!:Tienda
}