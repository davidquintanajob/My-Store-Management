import { IsDate, IsInt } from "class-validator";
import { BaseDTO } from "../config/base.dto";

export class SalidaDto extends BaseDTO{
    @IsInt()
    id_salida!:number;

    @IsDate()
    fecha!:Date;

    @IsInt()
    cantidad!:number;
}