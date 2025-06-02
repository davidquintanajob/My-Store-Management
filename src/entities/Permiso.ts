import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permiso extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_permiso!:number

    @Column()
    descripcion!:string
    
    @Column()
    nombre_permiso!:string
}