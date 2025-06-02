import React, { useState } from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Animated,
  View,
  Modal,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { Colors } from '../styles/Colors';

interface CustomDropdownProps {
  imageSource: any;
  text: string;
  options: { label: string; value: string; image: any }[]; // Agregar imagen a cada opción
  onSelect: (value: string) => void;
  isSelected: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  imageSource,
  text,
  options,
  onSelect,
  isSelected,
}) => {
  const [scale] = useState(new Animated.Value(1));
  const { width } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);

  const isMobile = width < 930;

  const buttonStyles = [
    isMobile ? styles.mobileButton : styles.desktopButton,
    isSelected && { backgroundColor: Colors.azul_Oscuro },
  ];
  const viewStyles = isMobile ? styles.mobileContent : styles.desktopContent;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 1.5,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setModalVisible(false);
  };

  return (
    <View>
      {/* Botón para abrir el dropdown */}
      <TouchableOpacity
        style={buttonStyles}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => setModalVisible(true)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={viewStyles}>
            <Image source={imageSource} style={styles.image} />
            <Text style={styles.text}>{text}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Modal para mostrar las opciones */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={isMobile? styles.modalContentMovil : styles.modalContentDesktop}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}
                >
                  <Image source={item.image} style={styles.optionImage} /> {/* Imagen antes del label */}
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileButton: {
    backgroundColor: Colors.azul_Claro,
    borderRadius: 15,
    height: 80,
    width: "180%",
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  desktopButton: {
    backgroundColor: Colors.azul_Claro,
    borderRadius: 15,
    width: "4%",
    minWidth: 120,
    height: 100,
    marginHorizontal: 10,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  desktopContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  mobileContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    color: Colors.blanco,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentDesktop: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '30%',
    maxHeight: '50%',
  },
  modalContentMovil: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  option: {
    flexDirection: 'row', // Para alinear imagen y texto en línea
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionImage: { // Estilo para la imagen de cada opción
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: Colors.negro
  },
  optionText: {
    fontSize: 18,
    color: Colors.azul_Oscuro,
  },
});

export default CustomDropdown;
