import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from './Producto';
import { Servicio } from "./Servicio";

@Entity()
export class Venta extends BaseEntity{

    @PrimaryColumn()
    id_producto!:number

    @PrimaryColumn()
    id_servicio!:number

    @Column()
    cantidad!:number

    @ManyToOne(()=>Producto,(producto:Producto)=>producto.id_producto,{cascade:true})
    @JoinColumn({name:"id_producto"})
    producto!:Producto

    @OneToOne(()=>Servicio,(servicio:Servicio)=>servicio.venta,{cascade:true})
    @JoinColumn({name:"id_servicio"})
    servicio!:Servicio
}