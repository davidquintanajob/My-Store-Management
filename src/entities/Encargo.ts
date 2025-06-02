import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Servicio } from "./Servicio";

@Entity()
export class Encargo extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_encargo!:number

    @Column("float")
    adelanto!:number

    @Column({type:"date"})
    fecha_final!:Date

    @OneToOne(()=>Servicio,(servicio:Servicio)=>servicio.encargo)
    @JoinColumn({name:"id_servicio"})
    servicio!:Servicio

}