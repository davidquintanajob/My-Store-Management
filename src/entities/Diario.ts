import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tienda } from "./Tienda";
import { Servicio } from "./Servicio";

@Entity()
export class Diario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_diario!: number;

  @Column({ type: Date })
  fecha_registro!: Date;

  @Column("float")
  costo_total_salario_trabajadores!: number;

  @Column("float")
  costo_total_comicion_trabajadores!: number;

  @Column("float")
  costo_total_servicios!: number;

  @Column("float")
  otros_costos!: number;

  @Column("float")
  ganancia_total_servicios!: number;

  @ManyToOne(() => Tienda, (tienda: Tienda) => tienda.diarios)
  @JoinColumn({ name: "id_tienda" })
  tienda!: Tienda;

  @OneToMany(() => Servicio, (servicio: Servicio) => servicio.diario)
  servicios!: Servicio[];
}