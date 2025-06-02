// src/DTO/DiarioDto.ts
import { IsDate, IsNumber, IsInt } from "class-validator";
import { BaseDTO } from "../config/base.dto";

export class DiarioDto extends BaseDTO {
  @IsInt()
  id_diario!: number;

  @IsDate()
  fecha_registro!: Date;

  @IsNumber()
  costo_total_salario_trabajadores!: number;

  @IsNumber()
  costo_total_comicion_trabajadores!: number;

  @IsNumber()
  costo_total_servicios!: number;

  @IsNumber()
  otros_costos!: number;

  @IsNumber()
  ganancia_total_servicios!: number;

  @IsInt()
  id_tienda!: number;
}