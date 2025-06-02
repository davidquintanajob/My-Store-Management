import { IsString, IsInt } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class TiendaDto extends BaseDTO{
    @IsInt()
    id_tienda!:number

    @IsString()
    nombre!:string

    @IsString()
    direccion!:string
}