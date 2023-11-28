import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState('')

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
      <Calendar />
      <Text>{selectedDay}</Text>
      <Button title='Lisää treeni' onPress={() => console.log("tästä treenin lisäykseen")} />
    </View>
  );
}
