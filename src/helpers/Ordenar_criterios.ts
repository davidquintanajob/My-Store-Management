import { log } from "console";
import { Producto } from "../entities/Producto";
import { Servicio } from "../entities/Servicio";
import { Proveedor } from "../entities/Proveedor";
import { Entrada } from "../entities/Entrada";
import { Cliente } from "../entities/Cliente";
import { Garantia } from "../entities/Garantia";



export function OrdenarProducto(ascendente: boolean, productos: any[], criterioOrden: string) {
  return productos.sort((a, b) => {
    let comparison = 0;

    switch (criterioOrden) {
      case "option3": // Ordenar por nombre
        comparison = a.nombre.localeCompare(b.nombre);
        break;
      case "option4": // Ordenar por precioUSD
        comparison = parseFloat(a.precioUSD) - parseFloat(b.precioUSD);
        break;
      case "option5": // Ordenar por cantidadTotal
        comparison = parseInt(a.cantidadTotal) - parseInt(b.cantidadTotal);
        break;
      default:
        return 0; // Si no coincide con ninguna opción, no se realiza orden
    }
    return ascendente ? comparison : -comparison;
  });
}
        
        export function OrdenarServicio(ascendente:boolean,servicios:any[],criterioOrden:string){
          return servicios.sort((a, b) => {
            // Definir la lógica para comparar dependiendo del criterioOrden
            let comparison = 0;
            
            switch (criterioOrden) {
              case "option3": // Ordenar por nombre
              const fechaA = new Date(a.fecha);
              const fechaB = new Date(b.fecha);
              comparison = fechaA.getTime() - fechaB.getTime();
                break;
              case "option4": // Ordenar por precioUSD
              comparison = a.nombreCliente.localeCompare(b.nombreCliente); // Corrige aquí
                break;
              case "option5": // Ordenar por cantidadTotal
                comparison = a.precio-b.precio;
                break;
              default:
                return 0; // Si no coincide con ninguna opción, no se realiza orden
            }
        
            // Invertir el orden si el tipoOrden es "option2" (mayor a menor) 
            return ascendente ? comparison : -comparison;
          });
        }
        export function OrdenarProveedores(ascendente: boolean, proveedores: Proveedor[], criterioOrden: string) {

          let proveedores_null=[]

          switch (criterioOrden) {
            case "option3": // Ordenar por nombre
             proveedores_null=proveedores.filter((proveedor:Proveedor)=>proveedor.nombre==null);
             proveedores=proveedores.filter((proveedor:Proveedor)=>proveedor.nombre!=null);
             proveedores.sort((a, b) => {
              let comparison = 0;
              comparison=a.nombre.localeCompare(b.nombre)
             
              return ascendente ? comparison : -comparison;
            });    
              break;
            case "option4": // Ordenar por precioUSD
             proveedores_null=proveedores.filter((proveedor:Proveedor)=>proveedor.email==null);
             proveedores_null=proveedores.filter((proveedor:Proveedor)=>proveedor.email==null);
             proveedores.sort((a, b) => {
              let comparison = 0;
              comparison=a.email.localeCompare(b.email)
             
              return ascendente ? comparison : -comparison;
            });          
            break;
            case "option5": // Ordenar por cantidadTotal
            proveedores_null=proveedores.filter((proveedor:Proveedor)=>proveedor.telefono==null);
            proveedores=proveedores.filter((proveedor:Proveedor)=>proveedor.telefono!=null); 
            proveedores.sort((a, b) => {
              let comparison = 0;
              comparison=a.telefono.localeCompare(b.telefono)
             
              return ascendente ? comparison : -comparison;
            });                
            break;
              case "option6": // Ordenar por cantidadTotal
              proveedores_null=proveedores.filter((proveedor:Proveedor)=>proveedor.detalle_bancario==null);
              proveedores=proveedores.filter((proveedor:Proveedor)=>proveedor.detalle_bancario!=null);               
              proveedores.sort((a, b) => {
                let comparison = 0;
                comparison=a.detalle_bancario.localeCompare(b.detalle_bancario)
               
                return ascendente ? comparison : -comparison;
              });    
              break;
            default:
              return 0; // Si no coincide con ninguna opción, no se realiza orden
          }
          proveedores_null.forEach((proved_null)=>{
            proveedores.push(proved_null);

          })
          return proveedores;
        }
        export function OrdenarEntradas(ascendente: boolean, entradas: any[], criterioOrden: string) {
          return entradas.sort((a, b) => {
            let comparison = 0;
        
            switch (criterioOrden) {
              case "option3": // Ordenar por nombre
                comparison = a.nombre_Proveedor.localeCompare(b.nombre_Proveedor);
                break;
              case "option4": // Ordenar por precioUSD
              comparison = a.nombre_Producto.localeCompare(b.nombre_Producto);
              break;
              case "option5": // Ordenar por cantidadTotal
                comparison = a.costo - b.costo;
                break;
                case "option6": // Ordenar por fecha
                const fechaA = new Date(a.fecha);
                const fechaB = new Date(b.fecha);
                comparison = fechaA.getTime() - fechaB.getTime();
                break;
              default:
                return 0; // Si no coincide con ninguna opción, no se realiza orden
            }
            return ascendente ? comparison : -comparison;
          });
        }
        export function OrdenarSalidas(ascendente: boolean, salidas: any[], criterioOrden: string) {
          return salidas.sort((a, b) => {
            let comparison = 0;
        
            switch (criterioOrden) {
              case "option3": // Ordenar por nombre
                comparison = a.nombre_Usuario.localeCompare(b.nombre_Usuario);
                break;
              case "option4": // Ordenar por precioUSD
              comparison = a.nombre_Producto.localeCompare(b.nombre_Producto);
              break;
              case "option5": // Ordenar por cantidadTotal
                comparison = a.cantidad - b.cantidad;
                break;
                case "option6": // Ordenar por fecha
                const fechaA = new Date(a.fecha);
                const fechaB = new Date(b.fecha);
                comparison = fechaA.getTime() - fechaB.getTime();
                break;
              default:
                return 0; // Si no coincide con ninguna opción, no se realiza orden
            }
            return ascendente ? comparison : -comparison;
          });
        }
        export function OrdenarUsuario(ascendente: boolean, usuario: any[], criterioOrden: string) {
          return usuario.sort((a, b) => {
            let comparison = 0;
        
            switch (criterioOrden) {
              case "option3": // Ordenar por nombre
                comparison = a.nombre_Usuario.localeCompare(b.nombre_Usuario);
                break;
              case "option4": // Ordenar por precioUSD
              comparison = a.correo.localeCompare(b.correo);
              break;
              case "option5": // Ordenar por cantidadTotal
              comparison = a.telefono.localeCompare(b.telefono);
                break;

              default:
                return 0; // Si no coincide con ninguna opción, no se realiza orden
            }
            return ascendente ? comparison : -comparison;
          });
        }
        export function OrdenarAccion(ascendente: boolean, acciones: any[], criterioOrden: string) {
          return acciones.sort((a, b) => {
            let comparison = 0;
        
            switch (criterioOrden) {
              case "option3": // Ordenar por nombre
              comparison = a.nombre_Usuario.localeCompare(b.nombre_Usuario); // Corrige aquí
                break;
              case "option4": // Ordenar por precioUSD
              const fechaA = new Date(a.fecha);
              const fechaB = new Date(b.fecha);
              comparison = fechaA.getTime() - fechaB.getTime();
              break;
             
              default:
                return 0; // Si no coincide con ninguna opción, no se realiza orden
            }
            return ascendente ? comparison : -comparison;
          });
        }
        export function OrdenarClientes(ascendente: boolean, clientes: any[], criterioOrden: string){
            
          let clientes_null=[]

          switch (criterioOrden) {
            case "option3": // Ordenar por nombre
             clientes_null=clientes.filter((proveedor:Cliente)=>proveedor.nombre==null);
             clientes=clientes.filter((proveedor:Cliente)=>proveedor.nombre!=null);
             clientes.sort((a, b) => {
              let comparison = 0;
              comparison=a.nombre.localeCompare(b.nombre)
             
              return ascendente ? comparison : -comparison;
            });    
              break;
            case "option4": // Ordenar por precioUSD
             clientes_null=clientes.filter((cliente:Cliente)=>cliente.email==null);
             clientes_null=clientes.filter((cliente:Cliente)=>cliente.email==null);
             clientes.sort((a, b) => {
              let comparison = 0;
              comparison=a.email.localeCompare(b.email)
             
              return ascendente ? comparison : -comparison;
            });          
            break;
            case "option5": // Ordenar por cantidadTotal
            clientes_null=clientes.filter((proveedor:Cliente)=>proveedor.telefono==null);
            clientes=clientes.filter((proveedor:Cliente)=>proveedor.telefono!=null); 
            clientes.sort((a, b) => {
              let comparison = 0;
              comparison=a.telefono.localeCompare(b.telefono)
             
              return ascendente ? comparison : -comparison;
            });                
            break;
              case "option6": // Ordenar por cantidadTotal
              clientes_null=clientes.filter((proveedor:Proveedor)=>proveedor.detalle_bancario==null);
              clientes=clientes.filter((proveedor:Proveedor)=>proveedor.detalle_bancario!=null);               
              clientes.sort((a, b) => {
                let comparison = 0;
                comparison=a.detalle_bancario.localeCompare(b.detalle_bancario)
               
                return ascendente ? comparison : -comparison;
              });    
              break;
            default:
              return 0; // Si no coincide con ninguna opción, no se realiza orden
          }
          clientes_null.forEach((proved_null)=>{
            clientes.push(proved_null);

          })
          return clientes;
        }
        
        export function OrdenarGarantias(ascendente: boolean, garantias: any[], criterioOrden: string) {
          return garantias.sort((a, b) => {
            let comparison = 0;
        
            switch (criterioOrden) {
              case "option3": // Ordenar por fecha
              const fechaA = new Date(a.fecha);
              const fechaB = new Date(b.fecha);
              comparison = fechaA.getTime() - fechaB.getTime();
              break;
             
              default:
                return 0; // Si no coincide con ninguna opción, no se realiza orden
            }
            return ascendente ? comparison : -comparison;
          });
        }