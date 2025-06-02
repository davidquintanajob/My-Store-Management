import { IsNumber, IsInt,IsString } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class Tipo_servicioDto extends BaseDTO {

    @IsInt()
    id_tipo_servicio!:number

    @IsString()
    nombre!:string

    @IsNumber()
    costo!:number
}