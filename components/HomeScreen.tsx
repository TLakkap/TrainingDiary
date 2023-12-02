import { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { storeData, getData } from '../workoutStorage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../App';

interface Workout {
  id: string
  workout: string
  time: string
}

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const [selectedDay, setSelectedDay] = useState('')
  const [workouts, setWorkouts] = useState<Workout[]>([])

  // Calendar language to Finnish
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

  useEffect(() => {   //get workouts for the selected day
    const getWorkouts = async () => {
      if (selectedDay !== null){
        const response = await getData(selectedDay)
        if (response) {
          console.log("res:", response)
          if(Array.isArray(response)){
            console.log("on taulukko")
          } else {
            console.log("ei oo")
          }
          setWorkouts([])
          setWorkouts((prevWorkouts) => prevWorkouts.concat(response))
        } else {
          setWorkouts([])
        }
    }}
    getWorkouts()
  }, [selectedDay])  // gets new workouts for the day everytime the selectedDay is changed

  const showWorkouts = () => {
    if (workouts && workouts[0] !== null) {
        return workouts.map((w: Workout) => <Text key={w.id}>{w.workout} {w.time}</Text>)
     } else {
        return <Text>Ei vielä harjoituksia tälle päivälle</Text>
    }
  }

  const handleDayChange = (day: string) => {
    const parsedDate = new Date(day); // parse date from string
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
      {showWorkouts()}
      <Button title='Lisää harjoitus'
        onPress={() => navigation.navigate('AddWorkout', {selectedDay})} />
    </View>
  );
}
