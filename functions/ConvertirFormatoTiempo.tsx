export function isTimeInInterval(actualHour: String, startHour: String, endHour: String) {
  // Convertir las horas a minutos para facilitar la comparación
  const actualMinutes = parseInt(actualHour.split(':')[0]) * 60 + parseInt(actualHour.split(':')[1]);
  const startMinutes = parseInt(startHour.split(':')[0]) * 60 + parseInt(startHour.split(':')[1]);
  const endMinutes = parseInt(endHour.split(':')[0]) * 60 + parseInt(endHour.split(':')[1]);

  // Verificar si la hora actual está dentro del rango
  return (actualMinutes >= startMinutes && actualMinutes <= endMinutes);
}