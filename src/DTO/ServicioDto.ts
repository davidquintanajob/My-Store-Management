import { IsBoolean, IsDate, IsInt ,IsNumber, IsString} from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class ServicioDto extends BaseDTO {
    @IsInt()
    id_servicio!:number

    @IsDate()
    fecha!:Date

    @IsNumber()
    precio!:number

    @IsNumber()
    costo!:number

    @IsString()
    nota!:string

    @IsBoolean()
    devuelto!:boolean


    @IsString()
    descripcion!:string
}