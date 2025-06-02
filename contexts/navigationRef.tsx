// navigationRef.ts
import { createRef } from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../App";

// Define la referencia de navegación global con el tipo correcto
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

// Función de navegación global
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  // Asegúrate de que los parámetros sean correctamente tipados y pasados
  navigationRef.current?.navigate(name, params as any);
}
