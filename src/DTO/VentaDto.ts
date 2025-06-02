import { IsNumber, IsInt } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class VentaDto extends BaseDTO {
    
    @IsInt()
    id_producto!:number

    @IsInt()
    id_servicio!:number

    @IsInt()
    cantidad!:number
}