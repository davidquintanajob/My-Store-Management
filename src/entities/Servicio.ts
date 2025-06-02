import {
  BaseEntity,
  Column,
  Double,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tienda } from "./Tienda";
import { Tipo_servicio } from "./Tipo_servicio";
import { Garantia } from "./Garantia";
import { Deuda } from "./Deuda";
import { Encargo } from "./Encargo";
import { Cliente } from "./Cliente";
import { Venta } from "./Venta";
import { Diario } from "./Diario";

@Entity()
export class Servicio extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_servicio!: number;

  @Column({ type: Date })
  fecha!: Date;

  @Column("float")
  precio!: number;

  @Column("float", { default: 0 })
  costo!: number;

  @Column("float", { default: 0 })
  cantidad_transferida!: number;

  @Column({ nullable: true })
  nota!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({ default: false })
  devuelto!: boolean;
  @ManyToOne(() => Tienda, (tienda: Tienda) => tienda.servicios)
  @JoinColumn({ name: "id_tienda" })
  tienda!: Tienda;

  @ManyToOne(() => Diario, (diario: Diario) => diario.servicios, { nullable: true })
  @JoinColumn({ name: "id_diario" })
  diario!: Diario | null;

  @ManyToOne(
    () => Tipo_servicio,
    (tipo_servicio: Tipo_servicio) => tipo_servicio.id_tipo_servicio
  )
  @JoinColumn({ name: "id_tipo_servicio" })
  tipo_servicio!: Tipo_servicio;

  @ManyToOne(() => Cliente, (cliente: Cliente) => cliente.servicios)
  @JoinColumn({ name: "id_cliente" })
  cliente!: Cliente;

  @OneToOne(() => Garantia, (garantia: Garantia) => garantia.servicio)
  garantia!: Garantia;

  @OneToOne(() => Deuda, (deuda: Deuda) => deuda.servicio)
  deuda!: Deuda;

  @OneToOne(() => Venta, (venta: Venta) => venta.servicio)
  venta!: Venta;

  @OneToOne(() => Encargo, (encargo: Encargo) => encargo.servicio)
  encargo!: Encargo;
}
