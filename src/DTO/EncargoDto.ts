import { IsDate, IsNumber, IsInt } from "class-validator"
import { BaseDTO } from "../config/base.dto"
export class EncargoDto extends BaseDTO{

    @IsInt()
    id_encargo!:number

    @IsNumber()
    adelanto!:number

    @IsDate()
    fecha_final!:Date

}