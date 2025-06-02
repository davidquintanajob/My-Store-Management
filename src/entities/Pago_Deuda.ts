import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Deuda } from "./Deuda";

@Entity()
export class Pago_Deuda extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_pago_deuda!:number

    @Column("float")
    pagada!:number

    @Column({type:Date})
    fecha!:Date

    @ManyToOne(()=>Deuda,(deuda:Deuda)=>deuda.pagos_deuda)
    @JoinColumn({name:"id_deuda"})
    deuda!:Deuda
}