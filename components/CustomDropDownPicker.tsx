import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '../styles/Colors';

// Definir la interfaz para los props
interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  value: string | null; // Puede ser null si no hay valor seleccionado
  setValue: (value: string | null) => void; // Aceptar null como valor
  placeholder: string;
  items: DropdownItem[];
  searchable?: boolean;
  onDropdownOpen?: () => void; // Agregar el nuevo prop
}

const CustomDropdown: React.FC<DropdownProps> = ({
  value,
  setValue,
  items,
  placeholder: title,
  searchable = false, // Valor por defecto establecido en false
  onDropdownOpen, // Recibir el nuevo prop
}) => {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  const isMobile = width < 1150; // Puedes ajustar este umbral según sea necesario

  const textStyles = isMobile ? styles.dropdownTextMovil : styles.dropdownTextDesktop;

  // Efecto para llamar a onDropdownOpen cuando el dropdown se abre
  useEffect(() => {
    if (open && onDropdownOpen) {
      onDropdownOpen(); // Llama a la función cuando se abre el dropdown
    }
  }, [open]); // Este efecto se ejecuta cada vez que 'open' cambia

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen} // Esto ahora es correcto
        setValue={(val) => {
          setValue(val); // Aquí se espera un valor de tipo string | null
          setOpen(false); // Cerrar el dropdown al seleccionar un valor
        }}
        setItems={() => {}} // En este caso no se usa ya que los items se pasan como prop
        placeholder={title}
        style={styles.dropdown}
        textStyle={textStyles}
        dropDownContainerStyle={styles.dropdownContainer}
        searchable={searchable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: '5%',
    marginTop: '4%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dropdown: {
    backgroundColor: Colors.azul_Suave,
    borderColor: Colors.azul_Suave,
    borderRadius: 13,
    width: '90%',
    shadowColor: Colors.azul_Suave,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  dropdownTextDesktop: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.blanco,
  },
  dropdownTextMovil: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.blanco,
  },
  dropdownContainer: {
    borderColor: Colors.azul_Suave,
    backgroundColor: Colors.azul_Claro,
    width: '90%',
  },
});

export default CustomDropdown;
