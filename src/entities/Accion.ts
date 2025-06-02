import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn  } from "typeorm";
import { Usuario } from "./Usuario";
import { Tipo_accion } from "./Tipo_accion";

@Entity()
export class Accion extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_accion!:number

    @Column()
    descripcion!:string

    @Column({type:Date})
    fecha!:Date


    @ManyToOne(()=>Usuario,(usuario:Usuario)=>usuario.id_usuario)
    @JoinColumn({name:"id_usuario"})
    usuario!:Usuario

    @ManyToOne(()=>Tipo_accion,(tipo_accion:Tipo_accion)=>tipo_accion.id_tipo_accion)
    @JoinColumn({name:"id_tipo_accion"})
    tipo_accion!:Tipo_accion;
}