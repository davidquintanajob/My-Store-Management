import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { ServicioDto } from "../DTO/ServicioDto";
import { Servicio } from "../entities/Servicio";
import { Venta } from "../entities/Venta";
export class ServicioService extends BaseService<Servicio> {
  constructor() {
    super(Servicio);
  }
  // servicio para obtener todos los Servicios

  async findAllServicios(): Promise<Servicio[]> {
    return (await this.execRepository)
      .createQueryBuilder("Servicio")
      .leftJoinAndSelect("Servicio.cliente", "c")
      .leftJoinAndSelect("Servicio.tienda", "tienda")
      .leftJoinAndSelect("Servicio.tipo_servicio", "ts")
      .leftJoinAndSelect("Servicio.deuda", "deuda")
      .leftJoinAndSelect("Servicio.garantia", "garantia")
      .leftJoinAndSelect("Servicio.venta", "venta")
      .leftJoinAndSelect("Servicio.encargo", "encargo")
      .leftJoinAndSelect("venta.producto", "p")
      .leftJoinAndSelect("Servicio.diario", "diario")
      .getMany();
    //.find({relations:["cliente","tienda","tipo_servicio","deuda","garantia"]});
  }
  async findServicioById(id_servicio: number): Promise<Servicio | null> {
    return (await this.execRepository)
      .createQueryBuilder("Servicio")
      .leftJoinAndSelect("Servicio.cliente", "c")
      .leftJoinAndSelect("Servicio.tienda", "tienda")
      .leftJoinAndSelect("Servicio.tipo_servicio", "ts")
      .leftJoinAndSelect("Servicio.deuda", "deuda")
      .leftJoinAndSelect("Servicio.garantia", "garantia")
      .leftJoinAndSelect("Servicio.venta", "venta")
      .leftJoinAndSelect("Servicio.encargo", "encargo")
      .leftJoinAndSelect("venta.producto", "p")
      .leftJoinAndSelect("Servicio.diario", "diario")
      .where("Servicio.id_servicio=:id_servicio", { id_servicio })
      .getOne();
    //.findOneBy({ id_servicio });
  }
  // servicio para crear un Servicios
  async createServicio(body: ServicioDto): Promise<Servicio> {
    return (await this.execRepository).save(body);
  }

  async deleteServicio(id: number): Promise<DeleteResult> {
    return (await this.execRepository).delete(id);
  }
  // actualizar un Servicios
  async updateServicio(
    id: number,
    infoUpdate: ServicioDto
  ): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
  async GananciaTotalServicio(): Promise<number> {
    const ganancia_total = await this.findAllServicios();
    return ganancia_total.reduce(
      (acumulador, servicio: Servicio) => acumulador + servicio.precio,
      0
    );
  }
  async getServiciosPaginated(page: number) {
    const limite = 20;
    const offset = (page - 1) * limite;

    const servicios = await (await this.execRepository)
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.tienda", "t")
      .leftJoinAndSelect("s.tipo_servicio", "ts")
      .leftJoinAndSelect("s.cliente", "c")
      .take(limite)
      .skip(offset)
      .getMany();

    const cantidad_total_servicios = await (await this.execRepository)
      .createQueryBuilder("s")
      .getCount();

    return {
      servicios: servicios,
      pagina: page,
      cantidad_total_servicios: cantidad_total_servicios,
    };
  }
  async getServiciosbyTipo_servicio(id_tipo_servicio: number) {
    return (await this.execRepository)
      .createQueryBuilder("Servicio")
      .innerJoinAndSelect("Servicio.tipo_servicio", "tipo_servicio")
      .leftJoinAndSelect("Servicio.cliente", "c")
      .leftJoinAndSelect("Servicio.deuda", "deuda")
      .leftJoinAndSelect("Servicio.garantia", "garantia")
      .leftJoinAndSelect("Servicio.venta", "venta")
      .leftJoinAndSelect("Servicio.encargo", "encargo")
      .leftJoinAndSelect("venta.producto", "p")
      .leftJoinAndSelect("Servicio.tienda", "tienda")
      .leftJoinAndSelect("Servicio.diario", "diario")
      .where("tipo_servicio.id_tipo_servicio=:id_tipo_servicio", {
        id_tipo_servicio,
      })
      .getMany();
  }
  async filtrarServicio(
    nombre_cliente: string | null,
    precio_liminf: number | null,
    precio_limsup: number | null,
    fecha_liminf: Date | null,
    fecha_limsup: Date | null,
    id_tipo_servicio: number | null,
    id_tienda: number | null,
    nombre_producto: string | null
  ) {
    let servicios: Servicio[];
    const normalizeString = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    if (fecha_liminf && fecha_limsup == null) {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.venta", "venta")
        .leftJoinAndSelect("servicio.encargo", "encargo")
        .leftJoinAndSelect("venta.producto", "p")
        .leftJoinAndSelect("servicio.diario", "diario")
        .where("servicio.fecha>=:fecha_liminf", { fecha_liminf })
        .getMany();
    } else if (fecha_liminf == null && fecha_limsup) {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.venta", "venta")
        .leftJoinAndSelect("servicio.encargo", "encargo")
        .leftJoinAndSelect("venta.producto", "p")
        .leftJoinAndSelect("servicio.diario", "diario")
        .where("servicio.fecha<=:fecha_limsup", { fecha_limsup })
        .getMany();
    } else if (fecha_liminf && fecha_limsup) {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.venta", "venta")
        .leftJoinAndSelect("servicio.encargo", "encargo")
        .leftJoinAndSelect("venta.producto", "p")
        .leftJoinAndSelect("servicio.diario", "diario")
        .where(
          "servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf ",
          { fecha_limsup, fecha_liminf }
        )
        .getMany();
    } else {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.venta", "venta")
        .leftJoinAndSelect("servicio.encargo", "encargo")
        .leftJoinAndSelect("venta.producto", "p")
        .leftJoinAndSelect("servicio.diario", "diario")
        .getMany();
    }
    if (nombre_cliente) {
      const normalizedNombre = normalizeString(nombre_cliente);
      servicios = servicios.filter((servicio: Servicio) =>
        normalizeString(servicio.cliente.nombre)
          .toLowerCase()
          .includes(normalizedNombre)
      );
    }
    if (precio_liminf) {
      servicios = servicios.filter(
        (servicio) => servicio.precio >= precio_liminf
      );
    }
    if (precio_limsup) {
      servicios = servicios.filter(
        (servicio) => servicio.precio <= precio_limsup
      );
    }
    if (id_tipo_servicio) {
      console.log(id_tipo_servicio);
      console.log(servicios);
      servicios = servicios.filter(
        (servicio: Servicio) =>
          servicio.tipo_servicio.id_tipo_servicio == id_tipo_servicio
      );
    }
    if (id_tienda) {
      servicios = servicios.filter(
        (servicio) => servicio.tienda.id_tienda == id_tienda
      );
    }
    if (nombre_producto) {
      let auxiliar: Servicio[] = [];
      const normalizedNombre = normalizeString(nombre_producto);
      servicios.forEach((servicio: Servicio) => {
        const { venta } = servicio;
        if (venta != null) {
          if (
            normalizeString(venta.producto.nombre)
              .toLowerCase()
              .includes(normalizedNombre)
          ) {
            auxiliar.push(servicio);
          }
        }
      });
      servicios = auxiliar;
      // servicios= servicios.filter((servicio:Servicio)=>normalizeString(servicio.venta.producto.nombre).toLowerCase().includes(normalizedNombre))
    }
    return servicios;
  }
  async filtrarServicioJT(
    nombre_cliente: string | null,
    precio_liminf: number | null,
    precio_limsup: number | null,
    fecha_liminf: Date | null,
    fecha_limsup: Date | null,
    id_tipo_servicio: number,
    id_tienda: number | null
  ) {
    let servicios: Servicio[];
    const normalizeString = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    if (fecha_liminf && fecha_limsup == null) {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.diario", "diario")
        .where(
          "servicio.fecha>=:fecha_liminf and servicio.id_tipo_servicio=:id_tipo_servicio",
          { fecha_liminf, id_tipo_servicio }
        )
        .getMany();
    } else if (fecha_liminf == null && fecha_limsup) {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.diario", "diario")
        .where(
          "servicio.fecha<=:fecha_limsup and servicio.id_tipo_servicio=:id_tipo_servicio",
          { fecha_limsup, id_tipo_servicio }
        )
        .getMany();
    } else if (fecha_liminf && fecha_limsup) {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.diario", "diario")
        .where(
          "servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf and servicio.id_tipo_servicio=:id_tipo_servicio",
          { fecha_limsup, fecha_liminf, id_tipo_servicio }
        )
        .getMany();
    } else {
      servicios = await (await this.execRepository)
        .createQueryBuilder("servicio")
        .leftJoinAndSelect("servicio.cliente", "c")
        .leftJoinAndSelect("servicio.tienda", "tienda")
        .leftJoinAndSelect("servicio.tipo_servicio", "ts")
        .leftJoinAndSelect("servicio.diario", "diario")
        .where("servicio.id_tipo_servicio=:id_tipo_servicio", {
          id_tipo_servicio,
        })
        .getMany();
    }
    if (nombre_cliente) {
      const normalizedNombre = normalizeString(nombre_cliente);
      servicios = servicios.filter((servicio: Servicio) =>
        normalizeString(servicio.cliente.nombre)
          .toLowerCase()
          .includes(normalizedNombre)
      );
    }
    if (precio_liminf) {
      servicios = servicios.filter(
        (servicio) => servicio.precio >= precio_liminf
      );
    }
    if (precio_limsup) {
      servicios = servicios.filter(
        (servicio) => servicio.precio <= precio_limsup
      );
    }
    if (id_tienda) {
      servicios = servicios.filter(
        (servicio) => servicio.tienda.id_tienda == id_tienda
      );
    }

    return servicios;
  }
}
