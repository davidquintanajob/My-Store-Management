import { IsNumber, IsString } from "class-validator";
import { BaseDTO } from "../config/base.dto";

export class Tipo_accionDto extends BaseDTO{
    @IsNumber()
    id_tipo_accion!:number;
    
    @IsString()
    nombre!:string;
}