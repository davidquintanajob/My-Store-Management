import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '../styles/Colors';

interface DropdownProps {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  items: { label: string; value: string }[];
  onDropdownOpen?: () => void; // Agregar el prop
}

const CustomDropDownPikerFromMover: React.FC<DropdownProps> = ({
  value,
  setValue,
  items,
  placeholder: title,
  onDropdownOpen, // Añadir el prop a los parámetros
}) => {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (open && onDropdownOpen) {
      onDropdownOpen(); // Llama a la función cuando el dropdown se abre
    }
  }, [open, onDropdownOpen]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={() => {}}
        placeholder={title}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
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
  dropdownContainer: {
    borderColor: Colors.azul_Suave,
    backgroundColor: Colors.azul_Claro,
    width: '90%',
  },
});

export default CustomDropDownPikerFromMover;
