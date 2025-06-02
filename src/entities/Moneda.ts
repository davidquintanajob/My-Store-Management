import { BaseEntity,Column, PrimaryGeneratedColumn } from "typeorm";

export class Moneda extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_moneda!:number;

    @Column({ default: 340 })
    valor!:number;

    @Column({unique:true})
    nombre!:string;
}