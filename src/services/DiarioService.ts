// src/services/DiarioService.ts
import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { Diario } from "../entities/Diario";
import { DiarioDto } from "../DTO/DiarioDto";

export class DiarioService extends BaseService<Diario> {
  constructor() {
    super(Diario);
  }

  async findAllDiaros(): Promise<Diario[]> {
    return (await this.execRepository)
      .createQueryBuilder("Diario")
      .leftJoinAndSelect("Diario.tienda", "tienda")
      .leftJoinAndSelect("tienda.usuarios", "usuarios")
      .leftJoinAndSelect("Diario.servicios", "servicios")
      .leftJoinAndSelect("servicios.tipo_servicio", "tipo_servicio")
      .getMany();
  }

  async findDiarioById(id_diario: number): Promise<Diario | null> {
    return (await this.execRepository)
      .createQueryBuilder("Diario")
      .where("Diario.id_diario = :id_diario", { id_diario })
      .leftJoinAndSelect("Diario.tienda", "tienda")
      .leftJoinAndSelect("tienda.usuarios", "usuarios")
      .leftJoinAndSelect("Diario.servicios", "servicios")
      .leftJoinAndSelect("servicios.tipo_servicio", "tipo_servicio")
      .getOne();
  }

  async createDiario(body: DiarioDto): Promise<Diario> {
    return (await this.execRepository).save(body);
  }

  async deleteDiario(id: number): Promise<DeleteResult> {
    return (await this.execRepository).delete(id);
  }

  async updateDiario(id: number, infoUpdate: DiarioDto): Promise<UpdateResult> {
    return (await this.execRepository).update(id, infoUpdate);
  }
}