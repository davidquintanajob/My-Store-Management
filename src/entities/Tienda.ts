import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Servicio } from "./Servicio";
import { Producto } from "./Producto";
import { Diario } from "./Diario";

@Entity()
export class Tienda extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_tienda!: number;

  @Column()
  nombre!: string;

  @Column()
  direccion!: string;

  @Column("float", { default: 0 })
  comicion!: number;

  @Column({ type: "time", default: () => "CURRENT_TIME" })
  hora_apertura!: string;

  @Column({ type: "time", default: () => "CURRENT_TIME" })
  hora_cierre!: string;

  @OneToMany(() => Usuario, (usuario: Usuario) => usuario.tienda)
  usuarios!: Usuario[];

  @OneToMany(() => Servicio, (servicio: Servicio) => servicio.tienda)
  servicios!: Servicio[];

  @OneToMany(() => Diario, (diario: Diario) => diario.tienda)
  @JoinColumn({ name: "id_tienda" })
  diarios!: Diario[];

  @ManyToMany(() => Producto, (producto: Producto) => producto.id_producto)
  @JoinTable({
    name: "Producto_tienda",
    joinColumn: {
      name: "id_tienda",
      referencedColumnName: "id_tienda",
    },
    inverseJoinColumn: {
      name: "id_producto",
      referencedColumnName: "id_producto",
    },
  })
  producto!: Producto[];
}
