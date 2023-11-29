import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { storeData, getData } from './TrainingStorage'

interface Workout {
  liikunta: string;
  kesto: string;
}

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState('')
  const [trainings, setTrainings] = useState([])

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

  const workouts = [
    { liikunta: 'juoksu', kesto: '30 min' },
    { liikunta: 'voimaharjoittelu', kesto: '45 min' },
  ];

  useEffect(() => {     // Set today to selected day
    const today = new Date(); // Get this date
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months start from index 0
    const day = today.getDate();

    // Calendar library wants the date to be formatted like this (YYYY-MM-DD)
    //const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    const formattedDate = `${day}.${month}.${year}`
    console.log("täällä")
    setSelectedDay(formattedDate);    
  }, []);

  useEffect(() => {   //get trainings for the selected day
    const getTrainings = (async () => {
      console.log("täälläkin")
      const response = await getData(selectedDay)
      console.log("response:", response)
      setTrainings(response)
    })
    getTrainings()
  }, [selectedDay])

  const handleStoreData = async () => {
    try {
      await storeData(selectedDay, workouts);
      console.log('Treenit tallennettu onnistuneesti');
    } catch (error) {
      console.error('Virhe tallennuksessa:', error);
    }
  };

  const showTrainings = () => {
    if (trainings !== null) {
        return trainings.map((t: Workout) => <Text>{t.liikunta}</Text>)
     } else {
        return <Text>Ei vielä treenejä tälle päivälle</Text>
    }
  }

  const handleDayChange = (day: string) => {
    console.log("day:", day)
    const parsedDate = new Date(day); // Parsi päivämäärä merkkijonosta
    const formattedDate = `${parsedDate.getDate()}.${parsedDate.getMonth() + 1}.${parsedDate.getFullYear()}`;

    setSelectedDay(formattedDate)
  }

  return (
    <View>
      <Calendar 
        firstDay={1}  // Week starts from Monday
        onDayPress={(day) => handleDayChange(day.dateString)}
      />
      <Text>{selectedDay}</Text>
      {showTrainings()}
      <Button title='Lisää treeni' onPress={handleStoreData} />
    </View>
  );
}
