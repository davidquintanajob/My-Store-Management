"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenarProducto = OrdenarProducto;
exports.OrdenarServicio = OrdenarServicio;
exports.OrdenarProveedores = OrdenarProveedores;
exports.OrdenarEntradas = OrdenarEntradas;
exports.OrdenarSalidas = OrdenarSalidas;
exports.OrdenarUsuario = OrdenarUsuario;
exports.OrdenarAccion = OrdenarAccion;
exports.OrdenarClientes = OrdenarClientes;
exports.OrdenarGarantias = OrdenarGarantias;
function OrdenarProducto(ascendente, productos, criterioOrden) {
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
function OrdenarServicio(ascendente, servicios, criterioOrden) {
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
                comparison = a.precio - b.precio;
                break;
            default:
                return 0; // Si no coincide con ninguna opción, no se realiza orden
        }
        // Invertir el orden si el tipoOrden es "option2" (mayor a menor) 
        return ascendente ? comparison : -comparison;
    });
}
function OrdenarProveedores(ascendente, proveedores, criterioOrden) {
    let proveedores_null = [];
    switch (criterioOrden) {
        case "option3": // Ordenar por nombre
            proveedores_null = proveedores.filter((proveedor) => proveedor.nombre == null);
            proveedores = proveedores.filter((proveedor) => proveedor.nombre != null);
            proveedores.sort((a, b) => {
                let comparison = 0;
                comparison = a.nombre.localeCompare(b.nombre);
                return ascendente ? comparison : -comparison;
            });
            break;
        case "option4": // Ordenar por precioUSD
            proveedores_null = proveedores.filter((proveedor) => proveedor.email == null);
            proveedores_null = proveedores.filter((proveedor) => proveedor.email == null);
            proveedores.sort((a, b) => {
                let comparison = 0;
                comparison = a.email.localeCompare(b.email);
                return ascendente ? comparison : -comparison;
            });
            break;
        case "option5": // Ordenar por cantidadTotal
            proveedores_null = proveedores.filter((proveedor) => proveedor.telefono == null);
            proveedores = proveedores.filter((proveedor) => proveedor.telefono != null);
            proveedores.sort((a, b) => {
                let comparison = 0;
                comparison = a.telefono.localeCompare(b.telefono);
                return ascendente ? comparison : -comparison;
            });
            break;
        case "option6": // Ordenar por cantidadTotal
            proveedores_null = proveedores.filter((proveedor) => proveedor.detalle_bancario == null);
            proveedores = proveedores.filter((proveedor) => proveedor.detalle_bancario != null);
            proveedores.sort((a, b) => {
                let comparison = 0;
                comparison = a.detalle_bancario.localeCompare(b.detalle_bancario);
                return ascendente ? comparison : -comparison;
            });
            break;
        default:
            return 0; // Si no coincide con ninguna opción, no se realiza orden
    }
    proveedores_null.forEach((proved_null) => {
        proveedores.push(proved_null);
    });
    return proveedores;
}
function OrdenarEntradas(ascendente, entradas, criterioOrden) {
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
function OrdenarSalidas(ascendente, salidas, criterioOrden) {
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
function OrdenarUsuario(ascendente, usuario, criterioOrden) {
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
function OrdenarAccion(ascendente, acciones, criterioOrden) {
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
function OrdenarClientes(ascendente, clientes, criterioOrden) {
    let clientes_null = [];
    switch (criterioOrden) {
        case "option3": // Ordenar por nombre
            clientes_null = clientes.filter((proveedor) => proveedor.nombre == null);
            clientes = clientes.filter((proveedor) => proveedor.nombre != null);
            clientes.sort((a, b) => {
                let comparison = 0;
                comparison = a.nombre.localeCompare(b.nombre);
                return ascendente ? comparison : -comparison;
            });
            break;
        case "option4": // Ordenar por precioUSD
            clientes_null = clientes.filter((cliente) => cliente.email == null);
            clientes_null = clientes.filter((cliente) => cliente.email == null);
            clientes.sort((a, b) => {
                let comparison = 0;
                comparison = a.email.localeCompare(b.email);
                return ascendente ? comparison : -comparison;
            });
            break;
        case "option5": // Ordenar por cantidadTotal
            clientes_null = clientes.filter((proveedor) => proveedor.telefono == null);
            clientes = clientes.filter((proveedor) => proveedor.telefono != null);
            clientes.sort((a, b) => {
                let comparison = 0;
                comparison = a.telefono.localeCompare(b.telefono);
                return ascendente ? comparison : -comparison;
            });
            break;
        case "option6": // Ordenar por cantidadTotal
            clientes_null = clientes.filter((proveedor) => proveedor.detalle_bancario == null);
            clientes = clientes.filter((proveedor) => proveedor.detalle_bancario != null);
            clientes.sort((a, b) => {
                let comparison = 0;
                comparison = a.detalle_bancario.localeCompare(b.detalle_bancario);
                return ascendente ? comparison : -comparison;
            });
            break;
        default:
            return 0; // Si no coincide con ninguna opción, no se realiza orden
    }
    clientes_null.forEach((proved_null) => {
        clientes.push(proved_null);
    });
    return clientes;
}
function OrdenarGarantias(ascendente, garantias, criterioOrden) {
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
