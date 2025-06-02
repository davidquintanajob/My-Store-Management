"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapearProductos = MapearProductos;
function MapearProductos(productos) {
    const resultado = {};
    productos.forEach((producto) => {
        const { id_producto, nombre, Sku, precio, precio_empresa, tiendas } = producto;
        // Si el producto no está en el resultado, lo agregamos
        if (!resultado[id_producto]) {
            resultado[id_producto] = {
                "id_producto": id_producto,
                "nombre": nombre,
                "Sku": Sku,
                "precio": precio, // Mantener el precio original de la entrada
                "precio_empresa": precio_empresa, // Mantener el precio_empresa original de la entrada
                tiendas: [],
            };
        }
        tiendas.forEach((tienda) => {
            // Verificamos si la tienda ya existe en el producto
            const tiendaExistente = resultado[id_producto].tiendas.find((t) => t.id_tienda === tienda.id_tienda);
            if (tiendaExistente) {
                // Si la tienda ya existe, sumamos las cantidades
                tiendaExistente.cantidad += parseInt(tienda.cantidad, 10);
            }
            else {
                // Si la tienda no existe, la agregamos
                resultado[id_producto].tiendas.push({
                    id_tienda: tienda.id_tienda,
                    cantidad: parseInt(tienda.cantidad, 10),
                });
            }
        });
    });
    return Object.values(resultado);
}
