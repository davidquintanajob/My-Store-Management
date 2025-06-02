import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Tienda } from "./Tienda";
import { Producto } from "./Producto";

@Entity()
export class Producto_tienda extends BaseEntity{

    @PrimaryColumn()
    id_producto!:number

    @PrimaryColumn()
    id_tienda!:number

    @Column({default:0})
    cantidad!:number

    @ManyToOne(()=>Tienda,(tienda:Tienda)=>tienda.id_tienda,{cascade:true,})
    @JoinColumn({name:"id_tienda"})
    tienda!:Tienda

    @ManyToOne(()=>Producto,(producto:Producto)=>producto.id_producto,{cascade:true})
    @JoinColumn({name:"id_producto"})
    producto!:Producto
}