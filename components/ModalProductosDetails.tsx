import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../styles/Colors";
import { styles } from "../styles/Styles";
import CustomTextImputSearch from "./CustomTextImputSearch";
import { MyDateTableModalShowDatesTienda, TiendaShowModal } from "./MyDateTableModalShowDatesTienda";
import { MyDateTableModalShowDateProveedores, ProveedoresShowModal } from "./MyDateTableModalShowDateProveedores";
import { useState } from "react";
import { Asset, ImagePickerResponse, launchImageLibrary } from "react-native-image-picker";

export const ModalProductosDetails = (
  isVisible: boolean,
  columnasMyDateTableProveedorModal: string[],
  columnasMyDateTableTiendaModal: string[],
  tiendasByProducto: TiendaShowModal[],
  proveedorByProducto: ProveedoresShowModal[]
) => {

  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
    // Método para cargar las imágenes
    const handleImageUpload = () => {
        const options = {
          mediaType: "photo" as const, // Solo fotos
          quality: 1, // Calidad máxima de la imagen
          includeBase64: false, // No incluir en base64
          selectionLimit: 100, // Permitir seleccionar solo una imagen a la vez
        };
    
        // Abre la galería de imágenes
        launchImageLibrary(options, (response: ImagePickerResponse) => {
          if (response.didCancel) {
            console.log("El usuario canceló la selección de la imagen.");
          } else if (response.errorMessage) {
            console.error(
              "Error al seleccionar la imagen: ",
              response.errorMessage
            );
          } else if (response.assets && response.assets.length > 0) {
            // Agregar la nueva imagen al estado
            setSelectedImages((prevImages) => {
              // Calcula cuántas imágenes se pueden agregar sin exceder el límite de 100
              const availableSpace = 100 - prevImages.length; // Espacio disponible en el estado
              const newImages = response.assets.slice(0, availableSpace); // Selecciona solo las imágenes necesarias para no exceder el límite
              return [...prevImages, ...newImages]; // Agrega las nuevas imágenes al estado
            });
          } else {
            console.log("No se seleccionó ninguna imagen.");
          }
        });
      };
  const callModalAddProducto = () => {
    return !isVisible;
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={callModalAddProducto}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
        }}
      >
        <View
          style={{
            width: "60%",
            height: "90%",
            backgroundColor: Colors.blanco_Suave,
            borderRadius: 15,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {/* Botón de cerrar en la esquina superior derecha */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: Colors.rojo_oscuro,
              borderRadius: 30,
              marginRight: "3%",
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={callModalAddProducto}
          >
            <Text style={{ color: Colors.blanco_Suave }}>X</Text>
          </TouchableOpacity>

          <View style={styles.separatorNegro} />

          <Text
            style={{
              fontSize: 26,
              marginTop: "1%",
              color: Colors.negro,
              textShadowColor: "rgba(0, 0, 0, 0.5)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            Agregar Producto
          </Text>

          {/* ScrollView para permitir el desplazamiento del contenido */}
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 20, // Espacio al final del contenido
            }}
          >
            {/* Nombre del Producto */}
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={styles.labelTextModalDesktop}>
                Nombre Del Producto
              </Text>
            </View>
            <CustomTextImputSearch
              style={styles.textImputModal}
              cursorColor={Colors.azul_Oscuro}
              placeholder="Nombre del producto"
            />

            {/* Contenedor para los campos Precio y Precio de Empresa */}
            <View
              style={{
                width: "100%",
                justifyContent: "space-between", // Para separar los campos de forma uniforme
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
              }}
            >
              {/* Campo Precio */}
              <View style={{ width: "45%", marginLeft: "2%" }}>
                <Text style={styles.labelTextModalDesktop}>Precio</Text>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  placeholder="Precio"
                />
              </View>

              {/* Campo Precio de Empresa */}
              <View
                style={{
                  width: "45%",
                  marginLeft: "2%",
                  marginRight: "2%",
                }}
              >
                <Text style={styles.labelTextModalDesktop}>
                  Precio de empresa
                </Text>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  placeholder="Precio de empresa"
                />
              </View>
            </View>

            {/* Campo SKU */}
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
              }}
            >
              <View style={{ width: "45%", marginLeft: "2%" }}>
                <Text style={styles.labelTextModalDesktop}>Sku</Text>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  placeholder="Sku"
                />
              </View>
            </View>

            <View
              style={{
                borderColor: Colors.azul_Oscuro,
                borderWidth: 2,
                marginTop: "3%",
                borderRadius: 15,
                flexDirection: "row",
                height: 350,
                width: "90%",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  height: 300,
                  width: "45%",
                }}
              >
                <Text style={styles.labelTextModalDesktop}>
                  Tiendas en las que existe el producto
                </Text>
                <MyDateTableModalShowDatesTienda
                  columns={columnasMyDateTableTiendaModal}
                  items={tiendasByProducto}
                />
              </View>
              <View
                style={{
                  height: 300,
                  width: "45%",
                }}
              >
                <Text style={styles.labelTextModalDesktop}>
                  Historial de proveedores
                </Text>
                <MyDateTableModalShowDateProveedores
                  columns={columnasMyDateTableProveedorModal}
                  items={proveedorByProducto}
                />
              </View>
            </View>

            {/* Descripción */}
            <Text
              style={{
                fontSize: 20,
                marginTop: "1%",
                color: Colors.negro,
                textShadowColor: "rgba(0, 0, 0, 0.5)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Descripción
            </Text>
            <CustomTextImputSearch
              style={{
                height: 150,
                borderColor: Colors.azul_Oscuro,
                borderWidth: 1,
                shadowColor: Colors.azul_Suave,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 14,
                width: "90%",
                textAlignVertical: "top",
                padding: 10,
                marginTop: "2%",
                marginHorizontal: "5%",
                backgroundColor: Colors.blanco_Suave,
                borderRadius: 13,
                fontSize: 18,
                color: Colors.negro,
                textShadowColor: "rgba(0, 0, 0, 0.5)",
                textShadowOffset: { width: 0.5, height: 0.5 },
                textShadowRadius: 2,
                fontWeight: "bold",
                paddingHorizontal: 10,
              }}
              cursorColor={Colors.azul_Oscuro}
              placeholder="Escribe la descripción del producto"
              multiline={true}
              numberOfLines={5}
              scrollEnabled={true}
            />

            {/* Campo para cargar fotos */}
            <View
              style={{
                marginTop: 20,
                width: "90%",
                borderWidth: 1,
                borderColor: Colors.azul_Oscuro,
                borderRadius: 13,
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.blanco_Suave,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.negro,
                  marginBottom: "5%",
                }}
              >
                Cargar imágenes del producto
              </Text>

              {/* Botón para cargar imágenes */}
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.azul_Claro,
                  borderRadius: 15,
                  width: "90%", // Ancho fijo para pantallas de escritorio
                  height: 50, // Altura fija para pantallas de escritorio
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
                onPress={handleImageUpload}
              >
                <Text>Seleccionar Imagenes</Text>
              </TouchableOpacity>

              {/* Vista para mostrar las imágenes seleccionadas */}
              {selectedImages.length > 0 && (
                <ScrollView
                  horizontal={true}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    height: 100, // Ajusta la altura de la vista de imágenes
                  }}
                >
                  {selectedImages.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.uri }} // Usa la URI de la imagen
                      style={{
                        width: 100,
                        height: 100,
                        marginRight: 10,
                        borderRadius: 10,
                      }}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
