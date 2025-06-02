import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./Rol";
import { Accion } from "./Accion";
import { Tienda } from "./Tienda";
import { Permiso } from "./Permiso";
import { Salida } from "./Salida";

@Entity()
export class Usuario extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_usuario!:number

    @Column()
    nombre!:string

    @Column({unique:true})
    nombre_usuario!:string

    @Column()
    contrasenna!:string

    @Column()
    email!:string

    @Column({default:true})
    activo!:boolean

    @Column("float",{default:0})
    salario_CUP!:number

    @Column({nullable:true})
    telefono!:string

    @Column({nullable:true})
    direccion!:string

    @Column({nullable:true, unique:true})
    carnet_identidad!:string

    @Column({nullable:true})
    detalles_bancarios!:string

    @ManyToOne(()=>Rol,(rol:Rol)=>rol.id_rol)
    @JoinColumn({name:"id_rol"})
    rol!:Rol

    @OneToMany(()=>Accion,(accion:Accion)=>accion.id_accion)
    acciones!:Accion[]

    @ManyToOne(()=>Tienda,(tienda:Tienda)=>tienda.usuarios)
    @JoinColumn({name:"id_tienda"})
    tienda!:Tienda

    @OneToMany(()=>Salida,(salida:Salida)=>salida.usuario)
    salidas!:Salida[];

    @ManyToMany(()=>Permiso,(permiso:Permiso)=>permiso.id_permiso)
    @JoinTable({name:"permiso_especial",joinColumn:{
        name:"id_usuario",
        referencedColumnName:"id_usuario"
    }, inverseJoinColumn:{
        name:"id_permiso",
        referencedColumnName:"id_permiso"
    }})
    permisos_especiales!:Permiso[]

}