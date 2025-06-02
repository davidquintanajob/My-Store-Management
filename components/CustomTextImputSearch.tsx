import React, { forwardRef } from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface CustomTextInputProps {
  cursorColor?: string;
  style: any;
  placeholder?: string;
  editable?: boolean;
  value?: string;
  scrollEnabled?: boolean;
  numberOfLines?: number;
  multiline?: boolean;
  onBlur?: () => void;
  onChangeText?: (text: string) => void;
  onKeyPress?: (event: any) => void; // Agregamos onKeyPress como opcional
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCompleteType?:
    | "off"
    | "username"
    | "password"
    | "email"
    | "name"
    | "tel"
    | "street-address"
    | "postal-code"
    | "cc-number"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year";
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "number-pad"
    | "name-phone-pad"
    | "decimal-pad"
    | "twitter"
    | "web-search"
    | "visible-password";
}

// Usa forwardRef para pasar correctamente el ref
const CustomTextInputSearch = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      placeholder,
      autoCapitalize,
      autoCompleteType,
      secureTextEntry,
      keyboardType,
      cursorColor,
      onChangeText,
      value,
      onBlur,
      style,
      multiline,
      numberOfLines,
      scrollEnabled,
      editable,
      onKeyPress, // Recibimos onKeyPress
    },
    ref // Aquí forwardRef expone la referencia
  ) => {
    return (
      <TextInput
        style={style}
        editable={editable}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.8)"
        autoCapitalize={autoCapitalize}
        autoComplete={autoCompleteType}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        cursorColor={cursorColor}
        value={value}
        scrollEnabled={scrollEnabled}
        multiline={multiline}
        onBlur={onBlur}
        ref={ref} // Asigna el ref al TextInput
        onChangeText={onChangeText}
        onKeyPress={onKeyPress} // Pasamos onKeyPress al TextInput
      />
    );
  }
);

export default CustomTextInputSearch;
