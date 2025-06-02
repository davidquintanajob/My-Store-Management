import { IsNumber, IsInt } from "class-validator"
import { BaseDTO } from "../config/base.dto"
export class GarantiaDto extends BaseDTO{

    @IsInt()
    id_garantia!:number

    @IsNumber()
    duracion!:number
   
}