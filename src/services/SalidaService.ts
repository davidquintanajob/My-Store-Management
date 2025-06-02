import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { SalidaDto } from "../DTO/SalidaDto";
import { Salida } from "../entities/Salida";
export class SalidaService extends BaseService<Salida> {
  constructor() {
    super(Salida);
  }
  // Salida para obtener todos los Salidas

  async findAllSalidas(): Promise<Salida[]> {
    return (await this.execRepository).find({
      relations: ["producto", "tienda_origen", "tienda_destino", "usuario"],
    });
  }
  async findSalidaById(id_salida: number): Promise<Salida | null> {
    return (await this.execRepository)
      .createQueryBuilder("salida")
      .leftJoinAndSelect("salida.tienda_origen", "to")
      .leftJoinAndSelect("salida.tienda_destino", "td")
      .leftJoinAndSelect("salida.usuario", "u")
      .leftJoinAndSelect("salida.producto", "p")
      .where("salida.id_salida=:id_salida", { id_salida })
      .getOne();
    //.findOneBy({ id_salida });
  }
  // Salida para crear un Salidas
  async createSalida(body: SalidaDto): Promise<Salida> {
    return (await this.execRepository).save(body);
  }
  async getSalidasPaginated(page: number) {
    const limite = 20;
    const offset = (page - 1) * limite;

    const salidas = await (await this.execRepository)
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.producto", "p")
      .leftJoinAndSelect("s.tienda_origen", "to")
      .leftJoinAndSelect("s.tienda_destino", "td")
      .leftJoinAndSelect("s.usuario", "u")
      .take(limite)
      .skip(offset)
      .getMany();

    const cantidad_total_salidas = await (await this.execRepository)
      .createQueryBuilder("s")
      .getCount();

    return {
      salidas: salidas,
      pagina: page,
      cantidad_total_salidas: cantidad_total_salidas,
    };
  }
  async deleteSalida(id: number): Promise<DeleteResult> {
    return (await this.execRepository).delete(id);
  }
  // actualizar un Salidas
  async updateSalida(id: number, infoUpdate: SalidaDto): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
  async filtrarSalida(
    nombre_usuario: string | null,
    nombre_producto: string | null,
    cantidad: number | null,
    fechaliminf: Date | null,
    fechalimsup: Date | null,
    id_tienda_origen: number | null,
    id_tienda_destino: number | null
  ) {
    let salidas: Salida[] = [];
    const normalizeString = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    console.log(
      nombre_usuario,
      nombre_producto,
      cantidad,
      fechaliminf,
      fechalimsup,
      id_tienda_origen,
      id_tienda_destino
    );

    if (fechaliminf && fechalimsup) {
      salidas = await (await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen", "to")
        .leftJoinAndSelect("salida.tienda_destino", "td")
        .leftJoinAndSelect("salida.usuario", "u")
        .leftJoinAndSelect("salida.producto", "p")
        .where("salida.fecha>=:fechaliminf and salida.fecha<=:fechalimsup", {
          fechaliminf,
          fechalimsup,
        })
        .getMany();
      console.log(salidas);
    } else if (fechaliminf) {
      salidas = await (await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen", "to")
        .leftJoinAndSelect("salida.tienda_destino", "td")
        .leftJoinAndSelect("salida.usuario", "u")
        .leftJoinAndSelect("salida.producto", "p")
        .where("salida.fecha>=:fechaliminf", { fechaliminf })
        .getMany();
    } else if (fechalimsup) {
      salidas = await (await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen", "to")
        .leftJoinAndSelect("salida.tienda_destino", "td")
        .leftJoinAndSelect("salida.usuario", "u")
        .leftJoinAndSelect("salida.producto", "p")
        .where("salida.fecha<=:fechalimsup", { fechalimsup })
        .getMany();
    } else {
      salidas = await (
        await this.execRepository
      ).find({
        relations: ["producto", "tienda_origen", "tienda_destino", "usuario"],
      });
    }

    if (nombre_usuario) {
      const normalizednombre_usuario = normalizeString(nombre_usuario);
      salidas = salidas.filter((salida: Salida) =>
        normalizeString(salida.usuario.nombre).includes(
          normalizednombre_usuario
        )
      );
    }
    if (nombre_producto) {
      const normalizedNombre_producto = normalizeString(nombre_producto);
      salidas = salidas.filter((salida: Salida) =>
        normalizeString(salida.producto.nombre).includes(
          normalizedNombre_producto
        )
      );
    }
    if (cantidad)
      salidas = salidas.filter(
        (salida: Salida) => salida.cantidad === cantidad
      );

    if (id_tienda_origen) {
      const auxiliar: Salida[] = [];
      salidas.forEach((salida: Salida) => {
        if (salida.tienda_origen.id_tienda === id_tienda_origen)
          auxiliar.push(salida);
      });
      salidas = auxiliar;
    }
    if (id_tienda_destino) {
      const auxiliar: Salida[] = [];
      salidas.forEach((salida: Salida) => {
        if (salida.tienda_destino.id_tienda === id_tienda_destino)
          auxiliar.push(salida);
      });
      salidas = auxiliar;
    }

    return salidas;
  }
  async filtrarSalidasJT(
    nombre_usuario: string | null,
    nombre_producto: string | null,
    cantidad: number | null,
    fechaliminf: string | null,
    fechalimsup: string,
    id_tienda: number,
    id_tienda_origen: number | null,
    id_tienda_destino: number | null
  ) {
    const normalizeString = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    let salidas: Salida[] = [];
    /*  let  salidas:Salida[]=await(await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen","to")
        .leftJoinAndSelect("salida.tienda_destino","td")
        .leftJoinAndSelect("salida.usuario","u")
        .leftJoinAndSelect("salida.producto","p")
        .where("to.id_tienda=:id_tienda or td.id_tienda=:id_tienda",{id_tienda})
        .getMany();*/
    const normalizeDate = (fecha: string): Date => {
      return new Date(fecha);
    };
    if (fechaliminf && fechalimsup) {
      salidas = await (await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen", "to")
        .leftJoinAndSelect("salida.tienda_destino", "td")
        .leftJoinAndSelect("salida.usuario", "u")
        .leftJoinAndSelect("salida.producto", "p")
        .where(
          "salida.fecha>=:fechaliminf and salida.fecha<=:fechalimsup and (to.id_tienda=:id_tienda or td.id_tienda=:id_tienda)",
          { fechaliminf, fechalimsup, id_tienda }
        )
        .getMany();
      console.log(salidas);
    } else if (fechaliminf != null && fechalimsup == null) {
      salidas = await (await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen", "to")
        .leftJoinAndSelect("salida.tienda_destino", "td")
        .leftJoinAndSelect("salida.usuario", "u")
        .leftJoinAndSelect("salida.producto", "p")
        .where(
          "salida.fecha>=:fechaliminf and (to.id_tienda=:id_tienda or td.id_tienda=:id_tienda)",
          { fechaliminf, id_tienda }
        )
        .getMany();
    } else if (fechalimsup != null && fechaliminf == null) {
      salidas = await (await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen", "to")
        .leftJoinAndSelect("salida.tienda_destino", "td")
        .leftJoinAndSelect("salida.usuario", "u")
        .leftJoinAndSelect("salida.producto", "p")
        .where(
          "salida.fecha<=:fechalimsup and(to.id_tienda=:id_tienda or td.id_tienda=:id_tienda)",
          { fechalimsup, id_tienda }
        )
        .getMany();
    } else {
      salidas = await (await this.execRepository)
        .createQueryBuilder("salida")
        .leftJoinAndSelect("salida.tienda_origen", "to")
        .leftJoinAndSelect("salida.tienda_destino", "td")
        .leftJoinAndSelect("salida.usuario", "u")
        .leftJoinAndSelect("salida.producto", "p")
        .where("to.id_tienda=:id_tienda or td.id_tienda=:id_tienda", {
          id_tienda,
        })
        .getMany();
    }
    console.log("-->" + salidas[0].fecha);
    if (nombre_usuario) {
      console.log("usuario-->" + salidas[0].fecha);
      const normalizednombre_usuario = normalizeString(nombre_usuario);
      salidas = salidas.filter((salida: Salida) =>
        normalizeString(salida.usuario.nombre_usuario).includes(
          normalizednombre_usuario
        )
      );
    }
    if (nombre_producto) {
      console.log("usuario-->" + salidas[0].fecha);
      const normalizedNombre_producto = normalizeString(nombre_producto);
      salidas = salidas.filter((salida: Salida) =>
        normalizeString(salida.producto.nombre).includes(
          normalizedNombre_producto
        )
      );
    }
    if (cantidad) {
      salidas = salidas.filter(
        (salida: Salida) => salida.cantidad === cantidad
      );
    }

    /*if(fechaliminf){
            console.log(salidas)
        salidas=salidas.filter((salida:Salida)=>salida.fecha.getTime()>=normalizeDate(fechaliminf).getTime())

        }
        if(fechalimsup){

            salidas=salidas.filter((salida:Salida)=>salida.fecha.getTime()<=normalizeDate(fechalimsup).getTime())
        }*/

    if (id_tienda_origen) {
      salidas = salidas.filter(
        (salida: Salida) => salida.tienda_origen.id_tienda == id_tienda_origen
      );
    }
    if (id_tienda_destino) {
      salidas = salidas.filter(
        (salida: Salida) => salida.tienda_destino.id_tienda == id_tienda_destino
      );
    }

    return salidas;
  }
}
