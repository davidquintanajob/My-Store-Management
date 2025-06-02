import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { ProveedorDto } from "../DTO/ProveedorDto";
import { Proveedor } from "../entities/Proveedor";
export class ProveedorService extends BaseService<Proveedor> {
   
    constructor(){
        super(Proveedor);
    }
	// servicio para obtener todos los Proveedors

    async findAllProveedores():Promise<Proveedor[]> {
        return (await this.execRepository).find({relations:["entradas"]});
    }
    async findProveedorById(id_proveedor: number): Promise<Proveedor | null> {
        return (await this.execRepository)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.entradas","e")
        .where("p.id_proveedor=:id_proveedor",{id_proveedor})
        .getOne();
      }
    // servicio para crear un Proveedors
 async createProveedor(body: ProveedorDto): Promise<Proveedor>{
        return (await this.execRepository).save(body);
    }

    async deleteProveedor(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Proveedors
   async updateProveedor(id: number, infoUpdate: ProveedorDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
    async filtrarProveedor(nombre: string | null, email: string | null, detalle_bancario: string | null, telefono: string | null) {
        let proveedores = await (await this.execRepository).find();
    
        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
        if (nombre) {
            const normalizedNombre = normalizeString(nombre);
            proveedores = proveedores.filter((proveedor: Proveedor) => normalizeString(proveedor.nombre).includes(normalizedNombre));
        }
        if (email) {
            const normalizedEmail = normalizeString(email);
            proveedores = proveedores.filter((proveedor: Proveedor) => proveedor.email != null && normalizeString(proveedor.email).includes(normalizedEmail));
        }
        if (detalle_bancario != null) {
            const normalizedDetalleBancario = normalizeString(detalle_bancario);
            proveedores = proveedores.filter((proveedor: Proveedor) => proveedor.detalle_bancario != null && normalizeString(proveedor.detalle_bancario).includes(normalizedDetalleBancario));
        }
        if (telefono) {
            const normalizedTelefono = normalizeString(telefono);
            proveedores = proveedores.filter((proveedor: Proveedor) => proveedor.telefono != null && normalizeString(proveedor.telefono).includes(normalizedTelefono));
        }
    
        return proveedores;
    }
    
        
    }
