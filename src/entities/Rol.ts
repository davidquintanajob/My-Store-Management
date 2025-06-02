import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permiso } from "./Permiso";

@Entity()
export class Rol extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_rol!:number

    @Column()
    nombre!:string

    @ManyToMany(()=>Permiso,(permiso:Permiso)=>permiso.id_permiso,{cascade:true})
    @JoinTable({name:"Rol_permiso",joinColumn:{
        name:"id_rol",
        referencedColumnName:"id_rol"
    }, inverseJoinColumn:{
        name:"id_permiso",
        referencedColumnName:"id_permiso"
    }})
    permisos!:Permiso[]
}