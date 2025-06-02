import Navbar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react"; // userState es un hook que permite manejar el estado en componentes
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import CustomButtonOptions from "../components/CustomButtonOptions";
import { Colors } from "../styles/Colors";
import { styles } from "../styles/Styles";
import CustomButtonAdministradorView from "../components/CustomButtonAdministradorView";


export function Administracion() {
    const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
    const isMobile = width < 930;
    const navigation = useNavigation();


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
                </View>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Navbar />
                <View
                    style={{
                        marginTop: 150,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                >
                    <CustomButtonAdministradorView
                        imageSource={require("../images/gerente.png")}
                        onPress={() => navigation.navigate("Usuarios")}
                        text={"Usuarios"}
                    />
                    <CustomButtonAdministradorView
                        imageSource={require("../images/gerente.png")}
                        onPress={() => navigation.navigate("Tiendas")}
                        text={"Tiendas"}
                    />
                </View>
                <View>

                </View>
            </View>
        );
    }
}
