import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./Producto";

@Entity()
export class Imagen extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_imagen!:number;

    @Column()
    url!:string

    @ManyToOne(()=>Producto)
    @JoinColumn({name:"id_producto"})
    producto!:Producto
}