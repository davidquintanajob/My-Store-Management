import { IsDate, IsNumber, IsString } from "class-validator";
import { BaseDTO } from "../config/base.dto";

export class AccionDto extends BaseDTO{
    
    @IsNumber()
    id_accion!:number

    @IsString()
    descripcion!:string

    @IsDate()
    fecha!:Date
}