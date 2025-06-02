import { IsNumber, IsInt, IsDate } from "class-validator"
import { BaseDTO } from "../config/base.dto"
export class EntradaDto extends BaseDTO{

    @IsInt()
    id_entrada!:number

    @IsNumber()
    costo!:number

    @IsInt()
    cantidad!:number

    @IsDate()
    fecha!:Date
}