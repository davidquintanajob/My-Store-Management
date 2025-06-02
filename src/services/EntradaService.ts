import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { EntradaDto } from "../DTO/EntradaDto";
import { Entrada } from "../entities/Entrada";

export class EntradaService extends BaseService<Entrada> {
  constructor() {
    super(Entrada);
  }
  // servicio para obtener todos los Entradas

  async findAllEntradas(): Promise<Entrada[]> {
    return (await this.execRepository).find({
      relations: ["proveedor", "producto", "tienda"],
    });
  }
  async findEntradaById(id_entrada: number): Promise<Entrada | null> {
    return (await this.execRepository)
      .createQueryBuilder("e")
      .leftJoinAndSelect("e.proveedor", "p")
      .leftJoinAndSelect("e.producto", "prod")
      .leftJoinAndSelect("e.tienda", "t")
      .where("e.id_entrada=:id_entrada", { id_entrada })
      .getOne();
  }
  // servicio para crear un Entradas
  async createEntrada(body: EntradaDto): Promise<Entrada> {
    return (await this.execRepository).save(body);
  }

  async deleteEntrada(id: number): Promise<DeleteResult> {
    return (await this.execRepository).delete(id);
  }
  // actualizar un Entradas
  async updateEntrada(
    id: number,
    infoUpdate: EntradaDto
  ): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }

  async filtrarEntradasConPaginacion(
    nombre_proveedor: string | null,
    nombre_producto: string | null,
    costo_liminf: number | null,
    costo_limsup: number | null,
    fecha_liminf: Date | null,
    fecha_limsup: Date | null,
    limite: number,
    pagina: number
  ): Promise<Entrada[]> {
    let entradas: Entrada[] = [];

    const normalizeString = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (fecha_liminf && fecha_limsup) {
      entradas = await (
        await this.execRepository
      )
        .createQueryBuilder("e")
        .leftJoinAndSelect("e.proveedor", "p")
        .leftJoinAndSelect("e.producto", "prod")
        .where("e.fecha >= :fecha_liminf AND e.fecha <= :fecha_limsup", {
          fecha_liminf,
          fecha_limsup,
        })
        .getMany();
    } else if (fecha_liminf) {
      entradas = await (await this.execRepository)
        .createQueryBuilder("e")
        .leftJoinAndSelect("e.proveedor", "p")
        .leftJoinAndSelect("e.producto", "prod")
        .where("e.fecha >= :fecha_liminf", { fecha_liminf })
        .getMany();
    } else if (fecha_limsup) {
      entradas = await (await this.execRepository)
        .createQueryBuilder("e")
        .leftJoinAndSelect("e.proveedor", "p")
        .leftJoinAndSelect("e.producto", "prod")
        .where("e.fecha <= :fecha_limsup", { fecha_limsup })
        .getMany();
    } else {
      entradas = await (
        await this.execRepository
      ).find({ relations: ["proveedor", "producto"] });
    }

    if (nombre_proveedor) {
      const normalizedNombre_proveedor = normalizeString(nombre_proveedor);
      entradas = entradas.filter((entrada: Entrada) =>
        normalizeString(entrada.proveedor.nombre).includes(
          normalizedNombre_proveedor
        )
      );
    }

    if (nombre_producto) {
      const normalizedNombre_producto = normalizeString(nombre_producto);
      entradas = entradas.filter((entrada: Entrada) =>
        normalizeString(entrada.producto.nombre).includes(
          normalizedNombre_producto
        )
      );
    }

    if (costo_liminf) {
      entradas = entradas.filter(
        (entrada: Entrada) => entrada.costo >= costo_liminf
      );
    }

    if (costo_limsup) {
      entradas = entradas.filter(
        (entrada: Entrada) => entrada.costo <= costo_limsup
      );
    }

    const offset = (pagina - 1) * limite;
    entradas = entradas.slice(offset, offset + limite);

    return entradas;
  }

  async getEntradasPaginated(page: number) {
    const limite = 20;
    const offset = (page - 1) * limite;

    const entradas = await (await this.execRepository)
      .createQueryBuilder("e")
      .leftJoinAndSelect("e.proveedor", "p")
      .leftJoinAndSelect("e.producto", "prod")
      .leftJoinAndSelect("e.tienda", "t")
      .take(limite)
      .skip(offset)
      .getMany();

    const cantidad_total_entradas = await (await this.execRepository)
      .createQueryBuilder("e")
      .getCount();

    return {
      entradas: entradas,
      pagina: page,
      cantidad_total_entradas: cantidad_total_entradas,
    };
  }

  async getAllEntradasbyProveedor(id_proveedor: number) {
    return (await this.execRepository)
      .createQueryBuilder("e")
      .leftJoinAndSelect("e.proveedor", "p")
      .leftJoinAndSelect("e.producto", "prod")
      .where("e.id_proveedor=:id_proveedor", { id_proveedor })
      .getMany();
  }
  /*
    nombre del prooveedor
    nombre producto
    rango de costo
    rango de fecha
    */
  async filtrarEntradas(
    nombre_proveedor: string | null,
    nombre_producto: string | null,
    costoliminf: number | null,
    costolimsup: number | null,
    fechaliminf: Date | null,
    fechalimsup: Date | null
  ) {
    let entradas: Entrada[] = [];
    const normalizeString = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (fechaliminf && fechalimsup) {
      entradas = await (
        await this.execRepository
      )
        .createQueryBuilder("e")
        .leftJoinAndSelect("e.proveedor", "p")
        .leftJoinAndSelect("e.producto", "prod")
        .where("e.fecha>=:fechaliminf and e.fecha<=:fechalimsup", {
          fechaliminf,
          fechalimsup,
        })
        .getMany();
      console.log(entradas);
    } else if (fechaliminf) {
      entradas = await (await this.execRepository)
        .createQueryBuilder("e")
        .leftJoinAndSelect("e.proveedor", "p")
        .leftJoinAndSelect("e.producto", "prod")
        .where("e.fecha>=:fechaliminf", { fechaliminf })
        .getMany();
    } else if (fechalimsup) {
      entradas = await (await this.execRepository)
        .createQueryBuilder("e")
        .leftJoinAndSelect("e.proveedor", "p")
        .leftJoinAndSelect("e.producto", "prod")
        .where("e.fecha<=:fechalimsup", { fechalimsup })
        .getMany();
    } else {
      entradas = await (
        await this.execRepository
      ).find({ relations: ["proveedor", "producto"] });
    }

    if (nombre_proveedor) {
      const normalizedNombre_proveedor = normalizeString(nombre_proveedor);
      entradas = entradas.filter((entrada: Entrada) =>
        normalizeString(entrada.proveedor.nombre).includes(
          normalizedNombre_proveedor
        )
      );
    }
    if (nombre_producto) {
      const normalizedNombre_producto = normalizeString(nombre_producto);
      entradas = entradas.filter((entrada: Entrada) =>
        normalizeString(entrada.producto.nombre).includes(
          normalizedNombre_producto
        )
      );
    }
    if (costoliminf)
      entradas = entradas.filter(
        (entrada: Entrada) => entrada.costo >= costoliminf
      );
    if (costolimsup)
      entradas = entradas.filter(
        (entradas: Entrada) => entradas.costo <= costolimsup
      );

    return entradas;
  }

  async EntradasbyProducto(id_producto: number) {
    return await (await this.execRepository)
      .createQueryBuilder("e")
      .leftJoinAndSelect("e.producto", "p")
      .leftJoinAndSelect("e.proveedor", "prov")
      .leftJoinAndSelect("e.tienda", "t")
      .where("p.id_producto=:id_producto", { id_producto })
      .getMany();
  }

  async getEntradasPorVencimiento(fecha: string) {
    const fechaVencimientoMaxima = new Date(fecha);
    const fechaActual = new Date();
  
    let entradas: Entrada[] = [];
  
    entradas = await (await this.execRepository)
      .createQueryBuilder("e")
      .leftJoinAndSelect("e.proveedor", "p")
      .leftJoinAndSelect("e.producto", "prod")
      .leftJoinAndSelect("e.tienda", "t") // Agregamos la relación con la tienda
      .where("e.fecha_vencimiento IS NOT NULL")
      .getMany();
  
    entradas = entradas.filter((entrada: Entrada) => {
      const fechaVencimiento = new Date(entrada.fecha_vencimiento);
      return fechaVencimiento >= fechaActual && fechaVencimiento <= fechaVencimientoMaxima;
    });
  
    return entradas;
  }
}
