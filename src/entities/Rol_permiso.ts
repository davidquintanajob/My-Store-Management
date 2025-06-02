import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, } from "typeorm";
import { Rol } from "./Rol";
import { Permiso } from "./Permiso";

@Entity()
export class Rol_permiso extends BaseEntity{
    @PrimaryColumn()
    id_permiso!:number

    @PrimaryColumn()
    id_rol!:number
    
    @Column({default:false})
    tiene!:boolean

    @ManyToOne(()=>Rol,(rol:Rol)=>rol.id_rol,{cascade:true})
    @JoinColumn({name:"id_rol"})
    rol!:Rol

    @ManyToOne(()=>Permiso,(permiso:Permiso)=>permiso.id_permiso,{cascade:true})
    @JoinColumn({name:"id_permiso"})
    permiso!:Permiso

}