import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Imagen } from "./Imagen";
import { Entrada } from "./Entrada";
import { Tienda } from "./Tienda";
import { Venta } from "./Venta";

@Entity()
export class Producto extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_producto!:number;

    @Column()
    nombre!:string;
    
    @Column()
    Sku!:string

    /*@Column({default:0})
    cantidad_total!:number;*/
    @Column("float")
    precio!:number

    @Column("float")
    precio_empresa!:number
    
    @Column({ type: 'float', default: 0.0 })
    costo_acumulado!: number;

    @Column({nullable:true})
    descripcion!:string;

    @Column({default:false})
    isFecha_Vencimiento!:boolean
    
    @OneToMany(()=>Imagen, (imagen)=>imagen.producto)
    imagenes!:Imagen[]

   @ManyToMany(()=>Tienda,{cascade:true})
   @JoinTable({name:"Producto_tienda",joinColumn:{
    name:"id_producto",
    referencedColumnName:"id_producto"
}, inverseJoinColumn:{
    name:"id_tienda",
    referencedColumnName:"id_tienda"
}})
   tiendas!:Tienda[]

   @OneToMany(()=>Venta,(venta:Venta)=>venta,{cascade:true})
   ventas!:Venta[]
}