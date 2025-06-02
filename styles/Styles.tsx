import { Platform, StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const styles = StyleSheet.create({
  radioButtonDesktop: {
    flexDirection: "row",
    height: 40,
    width: "12%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Oscuro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    borderColor: Colors.azul_Claro,
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: "1%",
    backgroundColor: Colors.azul_Suave, // Color de fondo del botón
  },
  radioButtonMovil: {
    flexDirection: "row",
    height: 40,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Oscuro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    borderColor: Colors.azul_Claro,
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
    marginRight: "5%",
    marginVertical: "5%",
    backgroundColor: Colors.azul_Suave, // Color de fondo del botón
  },
  radioButtonSelected: {
    backgroundColor: Colors.azul_Oscuro, // Color de fondo del botón seleccionado
  },
  radioButtonTextDesktop: {
    fontSize: 14,
    color: Colors.blanco, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  radioButtonTextMovil: {
    fontSize: 12,
    color: Colors.blanco, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  labelTextDesktop: {
    fontSize: 16,
    color: Colors.negro, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  labelTextModalDesktop: {
    fontSize: 16,
    marginTop: "3%",
    marginLeft: "6%",
    color: Colors.negro, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  labelTextModalMovil: {
    fontSize: 16,
    marginTop: "3%",
    marginLeft: "6%",
    color: Colors.negro, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  labelTextMovil: {
    fontSize: 20,
    marginRight: "15%",
    color: Colors.negro, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  radioButtonTextSelected: {
    fontWeight: "bold", // Texto en negritas para el botón seleccionado
    color: Colors.blanco_Suave, // Color del texto para el botón seleccionado
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
  navbarDekstop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  navbarMobile: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    width: "100%",
    zIndex: 1000,
  },
  menuIcon: {
    position: "absolute",
    left: 15,
    top: 15,
  },
  scrollContainer: {
    flexGrow: 1, // Permite que el contenido se expanda verticalmente
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10, // Añade algo de padding para mejorar el espaciado
  },
  buttonsContainerDesktop: {
    flexDirection: "row",
    justifyContent: "flex-start", // Alinea los botones al inicio después de la imagen
    flex: 1, // Ocupa el espacio restante
  },
  buttonContainterMovile: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainerDesktop: {
    height: "100%",
    width: "20%",
    marginTop: "2%",
    borderRadius: 20,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: "flex-start",
  },
  loginContainerStilesDesktop: {
    height: "70%",
    width: "25%",
    flexDirection: "column", // Cambiar a columna aquí
    borderRadius: 20,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainerStilesMovil: {
    height: "70%",
    width: "95%",
    flexDirection: "column", // Cambiar a columna aquí
    borderRadius: 20,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainerMovil: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    marginTop: "3%",
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: "flex-start",
  },
  modalViewMesajeContainerDesktop: {
    width: "40%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalViewMesajeContainerMovil: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  textSearchDesktop: {
    color: Colors.blanco,
    fontSize: 18,
    marginTop: "5%",
    justifyContent: "center",
    marginLeft: "6%",
    fontWeight: "bold", // Para negritas
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  textSearchMovil: {
    color: Colors.blanco,
    fontSize: 16,
    marginTop: "5%",
    justifyContent: "center",
    marginLeft: "6%",
    fontWeight: "bold", // Para negritas
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  textNavbarMovil: {
    color: Colors.blanco,
    fontSize: 17,
    justifyContent: "center",
    marginLeft: "6%",
    fontWeight: "bold", // Para negritas
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  textImputLogin: {
    height: 35,
    borderColor: Colors.azul_Suave,
    borderWidth: 1, // Ajusta el borde a ser más delgado
    shadowColor: Colors.azul_Suave, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    width: "90%",
    marginTop: "2%",
    backgroundColor: Colors.azul_Suave,
    borderRadius: 13,
    fontSize: 16, // Tamaño de letra más grande
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
  },
  textImputModal: {
    height: 40,
    borderColor: Colors.azul_Oscuro,
    borderWidth: 1, // Ajusta el borde a ser más delgado
    shadowColor: Colors.azul_Suave, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    width: "90%",
    marginTop: "2%",
    marginHorizontal: "5%",
    backgroundColor: Colors.blanco_Suave,
    borderRadius: 13,
    fontSize: 16, // Tamaño de letra más grande
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
  },
  textLabelAsInput: {
    height: 40, // Altura similar al TextInput
    borderColor: Colors.negro,
    borderWidth: 1, // Borde delgado
    shadowColor: Colors.negro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Opacidad de la sombra
    shadowRadius: 14, // Difuminado de la sombra
    width: "90%", // Ancho similar al TextInput
    marginTop: "2%",
    marginHorizontal: "5%",
    backgroundColor: Colors.blanco_Suave,
    borderRadius: 13,
    fontSize: 16, // Tamaño de letra
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno horizontal
    paddingVertical: 10, // Espacio interno vertical (ajusta según sea necesario)
    color: Colors.negro, // Color del texto
    lineHeight: 20, // Altura de línea igual a la altura del contenedor
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  textDescroptionLabelAsInput: {
    height: 150, // Altura similar al TextInput
    borderColor: Colors.negro,
    borderWidth: 1, // Borde delgado
    shadowColor: Colors.negro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Opacidad de la sombra
    shadowRadius: 14, // Difuminado de la sombra
    width: "90%", // Ancho similar al TextInput
    marginTop: "2%",
    marginHorizontal: "5%",
    backgroundColor: Colors.blanco_Suave,
    borderRadius: 13,
    fontSize: 16, // Tamaño de letra
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno horizontal
    paddingVertical: 10, // Espacio interno vertical (ajusta según sea necesario)
    color: Colors.negro, // Color del texto
    lineHeight: 20, // Altura de línea igual a la altura del contenedor
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  textImputModalNOEDITABLE: {
    height: 40,
    borderColor: Colors.negro,
    borderWidth: 1, // Ajusta el borde a ser más delgado
    width: "90%",
    marginTop: "2%",
    marginHorizontal: "5%",
    backgroundColor: Colors.blanco_Suave,
    borderRadius: 13,
    fontSize: 16, // Tamaño de letra más grande
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
  },
  customTextImputSearchFullDesktop: {
    height: 30,
    borderColor: Colors.azul_Suave,
    borderWidth: 1, // Ajusta el borde a ser más delgado
    shadowColor: Colors.azul_Suave, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    width: "90%",
    backgroundColor: Colors.azul_Suave,
    borderRadius: 13,
    marginLeft: "5%",
    marginTop: "4%",
    fontSize: 16, // Tamaño de letra más grande
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
  },
  customTextImputSearchFullMovil: {
    height: 30,
    borderColor: Colors.azul_Suave,
    borderWidth: 1, // Ajusta el borde a ser más delgado
    shadowColor: Colors.azul_Suave, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    width: "90%",
    backgroundColor: Colors.azul_Suave,
    borderRadius: 13,
    marginLeft: "5%",
    marginTop: "4%",
    fontSize: 12, // Tamaño de letra más grande
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
  },
  customTextImputSearchFiftyDesktop: {
    height: 30,
    borderColor: Colors.azul_Suave,
    borderWidth: 1, // Ajusta el borde a ser más delgado
    shadowColor: Colors.azul_Suave, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    width: "42.5%",
    backgroundColor: Colors.azul_Suave,
    borderRadius: 13,
    marginLeft: "5%",
    marginTop: "4%",
    fontSize: 16, // Tamaño de letra más grande
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
  },
  customTextImputSearchFiftyMovil: {
    height: 30,
    borderColor: Colors.azul_Suave,
    borderWidth: 1, // Ajusta el borde a ser más delgado
    shadowColor: Colors.azul_Suave, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    width: "42.5%",
    backgroundColor: Colors.azul_Suave,
    borderRadius: 13,
    marginLeft: "5%",
    marginTop: "4%",
    fontSize: 12, // Tamaño de letra más grande
    fontWeight: "bold", // Letra en negritas
    paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
  },
  movilButtonBusqueda: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 15,
    flexDirection: "row",
    width: "70%", // Ancho fijo para pantallas de escritorio
    height: 50, // Altura fija para pantallas de escritorio
    marginRight: "2%",
    marginTop: "2%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Oscuro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    elevation: 3,
  },
  separatorBlanco: {
    width: "90%", // Ancho del separador
    marginLeft: "5%",
    marginTop: "5%",
    height: 1, // Altura de la línea (grosor)
    backgroundColor: Colors.blanco, // Color blanco
  },
  separatorNegro: {
    width: "95%", // Ancho del separador
    marginTop: "8%",
    height: 1, // Altura de la línea (grosor)
    backgroundColor: Colors.negro, // Color blanco
  },
});
