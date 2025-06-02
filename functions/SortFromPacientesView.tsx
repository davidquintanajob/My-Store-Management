import { Producto } from "../components/MyDateTableProductos";

export function SortProductos(
  items: Producto[],
  tipoOrden: string,
  criterioOrden: string
): Producto[] {
  return items.sort((a, b) => {
    // Definir la lógica para comparar dependiendo del criterioOrden
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

    // Invertir el orden si el tipoOrden es "option2" (mayor a menor)
    if (tipoOrden === "option2") {
      comparison *= -1;
    }

    return comparison;
  });
}

