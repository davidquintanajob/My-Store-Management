import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from 'react-datepicker';

interface CustomDateTimePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
  style: any;
  placeholder?: string;
  editable?: boolean;
  cursorColor?: string;
}

const CustomDateTimePicker = forwardRef<DateTimePicker, CustomDateTimePickerProps>(
  (
    {
      selected,
      onChange,
      style,
      placeholder,
      editable,
      cursorColor,
    },
    ref
  ) => {
    return (
      <View style={style}>
        <DateTimePicker
          ref={ref}
          selected={selected}
          onChange={onChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Hora"
          dateFormat="h:mm aa"
          placeholderText={placeholder}
          editable={editable}
          cursorColor={cursorColor}
        />
      </View>
    );
  }
);

export default CustomDateTimePicker;