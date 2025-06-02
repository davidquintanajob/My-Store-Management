import Navbar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react"; // userState es un hook que permite manejar el estado en componentes
import { Image, Text, useWindowDimensions, View } from "react-native";
import { useUsuario } from "../contexts/UsuarioContext";
import { isPermiso } from "../services/RolPermisosAndRol";
import { usePermisosUsuario as usePermisosUsuarioNavbar } from "../contexts/PermisosNavbarContext";


export function HomeScreen() {
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  const isMobile = width < 930;
  const navigation = useNavigation();
  const { setUsuario, usuario } = useUsuario();
  const { permisosUsuarioNavbar, setPermisosUsuarioNavbar } = usePermisosUsuarioNavbar();
  
  useEffect(() =>{

    const cargarPermisosDeUsuario = async () =>{
      if (usuario?.token) {
        
        const resultProductoView = true; //Permiso 9
        const resultProveedorView = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 38
        const resultEntradaView = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 13
        const resultMovimientoLocalView = (true) //Permiso 30
        const resultMovimientoGeneralView = (true) //Permiso 31
        const resultAgregarUsuario = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 1
        const resultModificarUsuario = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 2
        const resultEliminarUsuario = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 3
        const resultAccionesView = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 15
        const resultAgregarTipoServicioView = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 20
        const resultModificarTipoServicioView = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 21
        const resultEliminarTipoServicioView = (parseInt(usuario.id_rol) !== 4 && parseInt(usuario.id_rol) !== 3) //Permiso 22
        const resultEliminarClienteView = (parseInt(usuario.id_rol) !== 4) //Permiso 18
        const resultModificarClienteView = (parseInt(usuario.id_rol) !== 4) //Permiso 17
        const resultAgregarClienteView = (parseInt(usuario.id_rol) !== 4) //Permiso 16
        const resultVerClienteView = parseInt(usuario.id_rol) !== 4 //Permiso 19
        const resultExpedirGarantiaView = false //Not Suport
        const resultModificarGarantiaView = false //Not Suport
        const resultVerGarantiaView = false //Not Suport
        
        setPermisosUsuarioNavbar({
          resultAccionesView: resultAccionesView,
          resultAgregarUsuario: resultAgregarUsuario,
          resultEliminarUsuario: resultEliminarUsuario,
          resultEntradaView: resultEntradaView,
          resultModificarUsuario: resultModificarUsuario,
          resultMovimientoGeneralView: resultMovimientoGeneralView,
          resultMovimientoLocalView: resultMovimientoLocalView,
          resultProductoView: resultProductoView,
          resultProveedorView: resultProveedorView,
          resultTipoServicio: (resultAgregarTipoServicioView || resultModificarTipoServicioView || resultEliminarTipoServicioView),
          resultClienteView: (resultVerClienteView || resultAgregarClienteView || resultModificarClienteView || resultEliminarClienteView),
          resultGarantiaView: (resultVerGarantiaView || resultExpedirGarantiaView || resultModificarGarantiaView)
        });

      }
    }

    cargarPermisosDeUsuario();

  },[])

  if (isMobile) {
    return (
      <View style={{ flex: 1 }}>
        <Navbar />
        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          {/*<Image
            source={require("../images/solutel.jpg")}
            style={{ width: "60%", height: "55%" }}
          />
          <Image
            source={require("../images/solutel1.jpg")}
            style={{ width: "90%", height: "30%" }}
          />*/}
        </View>
      </View>
    );
  }else{
    return (
      <View style={{ flex: 1 }}>
        <Navbar />
        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          {/*<Image
            source={require("../images/solutel.jpg")}
            style={{ width: "25%", height: "60%", marginTop: "5%" }}
          />
          <Image
            source={require("../images/solutel1.jpg")}
            style={{ width: "50%", height: "40%" }}
          />*/}
        </View>
      </View>
    );
  }
}
