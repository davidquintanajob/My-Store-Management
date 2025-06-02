import { BaseEntity, Column, Double, Entity,JoinColumn,OneToMany,OneToOne,PrimaryGeneratedColumn } from "typeorm";
import { Pago_Deuda } from "./Pago_Deuda";
import { Servicio } from './Servicio';

@Entity()
export class Deuda extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_deuda!:number
    
    @Column("float")
    deuda!:number

    @OneToMany(()=>Pago_Deuda,(pago_deuda:Pago_Deuda)=>pago_deuda.deuda)
    pagos_deuda!:Pago_Deuda[]

    @OneToOne(()=>Servicio,(servicio:Servicio)=>servicio.deuda)
    @JoinColumn({name:"id_servicio"})
    servicio!:Servicio
    
}