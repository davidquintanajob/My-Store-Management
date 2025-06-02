import { BaseEntity, Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tipo_servicio extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_tipo_servicio!:number

    @Column()
    nombre!:string

    @Column("float")
    costo!:number
}