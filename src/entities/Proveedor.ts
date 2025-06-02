import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entrada } from "./Entrada";

@Entity()
export class Proveedor extends BaseEntity{
    @PrimaryGeneratedColumn()
    id_proveedor!:number

    @Column()
    nombre!:string

    @Column({nullable:true})
    email!:string

    @Column({nullable:true})
    direccion!:string

    @Column({nullable:true})
    telefono!:string

    @Column({nullable:true})
    nota!:string

    @Column({nullable:true})
    Cif!:string

    @Column({nullable:true})
    detalle_bancario!:string

    @OneToMany(()=>Entrada,(entrada:Entrada)=>entrada.proveedor)
    entradas!:Entrada[];
}