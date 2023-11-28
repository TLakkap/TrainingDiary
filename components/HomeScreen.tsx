import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState('')

  LocaleConfig.locales['fi'] = {
    monthNames: [
      'Tammikuu',
      'Helmikuu',
      'Maaliskuu',
      'Huhtikuu',
      'Toukokuu',
      'Kesäkuu',
      'Heinäkuu',
      'Elokuu',
      'Syyskuu',
      'Lokakuu',
      'Marraskuu',
      'Joulukuu'
    ],
    monthNamesShort: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'],
    dayNames: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviiko', 'Torstai', 'Perjantai', 'Lauantai'],
    dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
    today: "Tänään"
  };
  LocaleConfig.defaultLocale = 'fi';

  useEffect(() => {     // Set today to selected day
    const today = new Date(); // Get this date
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months start from index 0
    const day = today.getDate();

    // Calendar library wants the date to be formatted like this (YYYY-MM-DD)
    //const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    const formattedDate = `${day}.${month}.${year}`

    setSelectedDay(formattedDate);
  }, []);

  return (
    <View>
      <Calendar 
        firstDay={1}  // Week starts from Monday
        onDayPress={day => setSelectedDay(day.dateString)}
      />
      <Text>{selectedDay}</Text>
      <Button title='Lisää treeni' onPress={() => console.log("tästä treenin lisäykseen")} />
    </View>
  );
}
