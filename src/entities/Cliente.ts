import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Servicio } from "./Servicio";

@Entity()
export class Cliente extends BaseEntity{
    @PrimaryGeneratedColumn()
    id_cliente!:number

    @Column()
    nombre!:string

    @Column({nullable:true})
    Cif!:string

    @Column({nullable:true})
    detalles_bancarios!:string

    @Column({nullable:true})
    nota!:string

    @Column({nullable:true})
    email!:string

    @Column({nullable:true})
    telefono!:string

    @Column({nullable:true})
    descripcion!:string

    @OneToMany(()=>Servicio,(servicio:Servicio)=>servicio.cliente)
    servicios!:Servicio[]

}