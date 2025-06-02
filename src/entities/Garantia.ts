import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Servicio } from "./Servicio";

@Entity()
export class Garantia extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_garantia!:number

    @Column()
    duracion!:number

    @OneToOne(()=>Servicio,(servicio:Servicio)=>servicio.garantia)
    @JoinColumn({name:"id_servicio"})
    servicio!:Servicio
   
}