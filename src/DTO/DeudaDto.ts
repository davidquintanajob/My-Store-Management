import { IsInt,IsNumber } from "class-validator";
import { BaseDTO } from "../config/base.dto";
export class DeudaDto extends BaseDTO{
    @IsInt()
    id_deuda!:number
    
    @IsNumber()
    deuda!:number
}