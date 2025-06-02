// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductosViwe from "./Views/ProductosView";
import { HomeScreen } from "./Views/HomeScreen";
import ServiciosView from "./Views/ServiciosView";
import LoginView from "./Views/LoginView";
import { UsuarioProvider } from "./contexts/UsuarioContext";
import { ModalProductsDatesProvider } from "./contexts/AuxiliarContextFromModalProductsDates";
import { SortProductosProvider } from "./contexts/AuxiliarSortProductos";
import { SortMovimientosDatesProvider } from "./contexts/AuxiliarSortMovimientos";
import { ModalProveedoresDatesProvider } from "./contexts/AuxiliarContextFromModalProveedores";
import { ModalEntradasDatesProvider } from "./contexts/AuxiliarContextModalEntradas";
import { SortEntradasProvider } from "./contexts/AuxiliarSortEntradas";
import { ImagenesDeleteProvider } from "./contexts/DeleteImagenContext";
import { SelectedButonProvider } from "./contexts/globalButonNavbarSelected";
import ProveedoresView from "./Views/ProveedoresView";
import EnMyTiendaView from "./Views/EnMyTiendaView";
import EntradasView from "./Views/EntradasView";
import { Administracion } from "./Views/AdministracionView";
import MovimientosView from "./Views/MovimientosView";
import { ModalMovimientosDatesProvider } from "./contexts/AuxiliarContextModalMovimientos";
import { NavigationLostDatesProvider } from "./contexts/NavigationLostContext";
import UsuariosView from "./Views/UsuariosView";
import TiendasView from "./Views/TiendasView";
import { SortUsuariosProvider } from "./contexts/AuxiliarSortUsuarios";
import AccionesView from "./Views/AccionesView";
import { SortAccionesProvider } from "./contexts/AuxiliarSortAcciones";
import PermisosView from "./Views/PermisosView";
import { PermisosUsuarioProvider } from "./contexts/PermisosNavbarContext";
import { PaginadoProductosProvider } from "./contexts/AuxiliarContextPaginadoproductos";
import TipoServicioView from "./Views/TipoServicioView";
import { SortServiciosProvider } from "./contexts/AuxiliarSortServicios";
import CambiarMonedaView from "./Views/CambiarMonedaView";
import ClientesView from "./Views/ClientesView";
import { SortClientesProvider } from "./contexts/AuxiliarSortClientes";
import GarantiasView from "./Views/GarantiasView";
import DeudasView from "./Views/DeudasView";
import DiarioView from "./Views/DiarioView";

// Importar la referencia de navegación global
import { navigationRef } from "./contexts/navigationRef";

export type RootStackParamList = {
  Login: undefined;
  Acciones: undefined;
  HomeScreen: undefined;
  Productos: undefined;
  Servicios: undefined;
  Proveedores: undefined;
  "Mi Tienda": undefined;
  Entradas: undefined;
  Movimientos: undefined;
  Administración: undefined;
  Usuarios: undefined;
  Tiendas: undefined;
  Permisos: undefined;
  "Tipo de Servicio": undefined;
  "Cambiar Moneda": undefined;
  ClientesView: undefined;
  Garantias: undefined;
  DeudasView: undefined;
  Diario: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <PermisosUsuarioProvider>
      <SortClientesProvider>
        <SortServiciosProvider>
          <PaginadoProductosProvider>
            <SortAccionesProvider>
              <SortUsuariosProvider>
                <NavigationLostDatesProvider>
                  <SelectedButonProvider>
                    <ModalMovimientosDatesProvider>
                      <SortMovimientosDatesProvider>
                        <ImagenesDeleteProvider>
                          <SortEntradasProvider>
                            <ModalEntradasDatesProvider>
                              <ModalProveedoresDatesProvider>
                                <SortProductosProvider>
                                  <ModalProductsDatesProvider>
                                    <UsuarioProvider>
                                      <NavigationContainer ref={navigationRef}>
                                        <Stack.Navigator initialRouteName="Login">
                                          <Stack.Screen
                                            name="Login"
                                            component={LoginView}
                                          />
                                          <Stack.Screen
                                            name="HomeScreen"
                                            component={HomeScreen}
                                          />
                                          <Stack.Screen
                                            name="Productos"
                                            component={ProductosViwe}
                                          />
                                          <Stack.Screen
                                            name="Ventas"
                                            component={ServiciosView}
                                          />
                                          <Stack.Screen
                                            name="Proveedores"
                                            component={ProveedoresView}
                                          />
                                          <Stack.Screen
                                            name="Mi Tienda"
                                            component={EnMyTiendaView}
                                          />
                                          <Stack.Screen
                                            name="Entradas"
                                            component={EntradasView}
                                          />
                                          <Stack.Screen
                                            name="Movimientos"
                                            component={MovimientosView}
                                          />
                                          <Stack.Screen
                                            name="Administración"
                                            component={Administracion}
                                          />
                                          <Stack.Screen
                                            name="Usuarios"
                                            component={UsuariosView}
                                          />
                                          <Stack.Screen
                                            name="Tiendas"
                                            component={TiendasView}
                                          />
                                          <Stack.Screen
                                            name="Acciones"
                                            component={AccionesView}
                                          />
                                          <Stack.Screen
                                            name="Permisos"
                                            component={PermisosView}
                                          />
                                          <Stack.Screen
                                            name="Clientes"
                                            component={ClientesView}
                                          />
                                          <Stack.Screen
                                            name="Tipo de Servicio"
                                            component={TipoServicioView}
                                          />
                                          <Stack.Screen
                                            name="Cambiar Moneda"
                                            component={CambiarMonedaView}
                                          />
                                          <Stack.Screen
                                            name="Garantías"
                                            component={GarantiasView}
                                          />
                                          <Stack.Screen
                                            name="Deudas"
                                            component={DeudasView}
                                          />
                                          <Stack.Screen
                                            name="Diario"
                                            component={DiarioView}
                                          />
                                        </Stack.Navigator>
                                      </NavigationContainer>
                                    </UsuarioProvider>
                                  </ModalProductsDatesProvider>
                                </SortProductosProvider>
                              </ModalProveedoresDatesProvider>
                            </ModalEntradasDatesProvider>
                          </SortEntradasProvider>
                        </ImagenesDeleteProvider>
                      </SortMovimientosDatesProvider>
                    </ModalMovimientosDatesProvider>
                  </SelectedButonProvider>
                </NavigationLostDatesProvider>
              </SortUsuariosProvider>
            </SortAccionesProvider>
          </PaginadoProductosProvider>
        </SortServiciosProvider>
      </SortClientesProvider>
    </PermisosUsuarioProvider>
  );
}

export default App;
