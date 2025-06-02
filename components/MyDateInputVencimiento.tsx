import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface DateInputProps {
  dayValue: string;
  monthValue: string;
  yearValue: string;
  onDayChange: (day: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  style?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  isReadOnly?: boolean;
  onDropdownOpen?: () => void; // Nueva propiedad para manejar la apertura del dropdown
}

export const MyDateInputVencimiento: React.FC<DateInputProps> = ({
  dayValue,
  monthValue,
  yearValue,
  onDayChange,
  onMonthChange,
  onYearChange,
  style,
  styleText,
  isReadOnly = false,
  onDropdownOpen, // Desestructuración de la nueva propiedad
}) => {
  const [day, setDay] = useState<string>(dayValue);
  const [month, setMonth] = useState<string>(monthValue);
  const [year, setYear] = useState<string>(yearValue);
  const [days, setDays] = useState<Array<{ label: string; value: string }>>([]);

  const [activePicker, setActivePicker] = useState<'day' | 'month' | 'year' | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    const numberOfDays = getDaysInMonth(Number(month), Number(year));
    const daysArray = Array.from({ length: numberOfDays }, (_, i) => ({
      label: String(i + 1),
      value: String(i + 1),
    }));

    if (Number(day) > numberOfDays) {
      setDay(String(numberOfDays));
    }

    setDays(daysArray);
  }, [month, year]);

  const updateDate = (newDay: string, newMonth: string, newYear: string) => {
    onDayChange(newDay);
    onMonthChange(newMonth);
    onYearChange(newYear);
  };

  const togglePicker = (picker: 'day' | 'month' | 'year') => {
    if (activePicker === picker) {
      setActivePicker(null);
    } else {
      setActivePicker(picker);
      onDropdownOpen && onDropdownOpen(); // Llama a onDropdownOpen cuando se abre un picker
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, styleText]}>Día</Text>
        <DropDownPicker
          open={activePicker === 'day'}
          value={day}
          items={days}
          setOpen={() => !isReadOnly && togglePicker('day')}
          setValue={(value) => {
            setDay(value);
            updateDate(value, month, year);
          }}
          style={styles.picker}
          containerStyle={[styles.pickerContainer, { zIndex: activePicker === 'day' ? 2 : 1 }]}
          dropDownContainerStyle={styles.dropDownContainer}
          disabled={isReadOnly}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={[styles.label, styleText]}>Mes</Text>
        <DropDownPicker
          open={activePicker === 'month'}
          value={month}
          items={Array.from({ length: 12 }, (_, i) => ({
            label: String(i + 1),
            value: String(i + 1),
          }))}
          setOpen={() => !isReadOnly && togglePicker('month')}
          setValue={(value) => {
            setMonth(value);
            updateDate(day, value, year);
          }}
          style={styles.picker}
          containerStyle={[styles.pickerContainer, { zIndex: activePicker === 'month' ? 2 : 1 }]}
          dropDownContainerStyle={styles.dropDownContainer}
          disabled={isReadOnly}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={[styles.label, styleText]}>Año</Text>
        <DropDownPicker
          open={activePicker === 'year'}
          value={year}
          items={Array.from({ length: 51 }, (_, i) => {
            const year = new Date().getFullYear() - 25 + i;
            return { label: String(year), value: String(year) };
          })}
          setOpen={() => !isReadOnly && togglePicker('year')}
          setValue={(value) => {
            setYear(value);
            updateDate(day, month, value);
          }}
          style={styles.picker}
          containerStyle={[styles.pickerContainer, { zIndex: activePicker === 'year' ? 2 : 1 }]}
          dropDownContainerStyle={styles.dropDownContainer}
          disabled={isReadOnly}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
  },
  picker: {
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 12,
  },
  pickerContainer: {
    height: 35,
    width: 80,
  },
  dropDownContainer: {
    borderColor: 'gray',
    zIndex: 9999,
  },
});
