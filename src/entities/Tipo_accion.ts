import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Accion } from "./Accion";

@Entity()
export class Tipo_accion extends BaseEntity{
    @PrimaryGeneratedColumn()
    id_tipo_accion!:number;

    @Column()
    nombre!:string;

   
}