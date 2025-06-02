import { IsNumber, IsInt } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class Producto_tiendaDto extends BaseDTO{

    @IsInt()
    id_producto!:number

    @IsInt()
    id_tienda!:number

    @IsInt()
    cantidad!:number
}