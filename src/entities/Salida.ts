import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tienda } from "./Tienda";
import { Usuario } from "./Usuario";
import { Producto } from "./Producto";

@Entity()
export class Salida extends BaseEntity{
    @PrimaryGeneratedColumn()
    id_salida!:number;

    @Column({type:Date})
    fecha!:Date;

    @Column()
    cantidad!:number;

    @ManyToOne(()=>Producto,(producto:Producto)=>producto.id_producto)
    @JoinColumn({name:"id_producto"})
    producto!:Producto;

    @ManyToOne(()=>Tienda,(tienda:Tienda)=>tienda.id_tienda)
    @JoinColumn({name:"id_tienda_origen"})
    tienda_origen!:Tienda;

    @ManyToOne(()=>Tienda,(tienda:Tienda)=>tienda.id_tienda)
    @JoinColumn({name:"id_tienda_destino"})
    tienda_destino!:Tienda;

    @ManyToOne(()=>Usuario,(usuario:Usuario)=>usuario.salidas)
    @JoinColumn({name:"id_usuario"})
    usuario!:Usuario;


}