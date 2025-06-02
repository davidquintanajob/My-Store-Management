import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Entrada } from "../components/MyDateTableEntradas";

// Recive las entradas de un producto y devuelve el costo promedio de ese producto
export const calcularPromedioAcomulado = (
  entradas: any[],
  cantidadEnLaEmpresa: number
) => {
  let cantidad_existencia: number = 0;
  let costo_promedio: Float = 0;
  let cantidadVendida: number = 0;

  // Sacar cantidad vendida
  entradas.forEach((entrada) => {
    cantidadVendida += entrada.cantidad;
  });
  cantidadVendida = cantidadVendida - cantidadEnLaEmpresa;
  
  entradas.forEach((entrada) => {
    let entradaActual: any = entrada;

    if (parseInt(entradaActual.cantidad) > cantidadVendida) {
      entradaActual.cantidad -= cantidadVendida;
      cantidadVendida = 0;
      let costo_i: Float = parseFloat(entradaActual.costo);
      let cantidad_i: Float = parseFloat(entradaActual.cantidad);
      costo_promedio =
        (cantidad_existencia * costo_promedio + cantidad_i * costo_i) /
        (cantidad_existencia + cantidad_i);
      cantidad_existencia = cantidad_existencia + cantidad_i;
    } else {
      cantidadVendida -= parseInt(entradaActual.cantidad);
    }
  });

  return costo_promedio.toFixed(5);
};
