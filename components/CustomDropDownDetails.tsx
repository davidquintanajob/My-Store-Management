import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '../styles/Colors';

interface DropdownProps {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  items: { label: string; value: string }[];
  searchable: boolean;
  readOnly?: boolean;
  onDropdownOpen?: () => void; // Nueva propiedad opcional
}

const CustomDropdownDetails: React.FC<DropdownProps> = ({
  value,
  setValue,
  items,
  placeholder: title,
  searchable,
  readOnly = false,
  onDropdownOpen,
}) => {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 1150;
  const textStyles = isMobile ? styles.dropdownTextMovil : styles.dropdownTextDesktop;

  // Efecto para llamar a `onDropdownOpen` cuando el dropdown se abre
  useEffect(() => {
    if (open && onDropdownOpen) {
      onDropdownOpen();
    }
  }, [open]);

  // Función de apertura condicional basada en `readOnly`
  const handleOpen = () => {
    if (!readOnly) {
      setOpen((prevOpen) => !prevOpen);
    }
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={handleOpen} // Llamada a la función `handleOpen`
        setValue={setValue}
        setItems={() => {}}
        placeholder={title}
        style={styles.dropdown}
        textStyle={textStyles}
        dropDownContainerStyle={styles.dropdownContainer}
        searchable={searchable && !readOnly}
        searchPlaceholder="Buscar..."
        searchTextInputStyle={styles.searchInput}
        zIndex={1000}
        disabled={readOnly}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '1%',
    marginLeft: '5%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
    position: 'relative',
  },
  dropdown: {
    backgroundColor: Colors.blanco,
    borderColor: Colors.azul_Suave,
    borderRadius: 13,
    width: '95%',
    shadowColor: Colors.azul_Suave,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    zIndex: 1000,
  },
  dropdownTextDesktop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.negro,
  },
  dropdownTextMovil: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.negro,
  },
  dropdownContainer: {
    borderColor: Colors.azul_Suave,
    backgroundColor: Colors.blanco,
    width: '95%',
    zIndex: 1000,
  },
  searchInput: {
    borderColor: Colors.azul_Suave,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
});

export default CustomDropdownDetails;
