import { useState, useEffect } from 'react';
import { Text, View, Button, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { storeData, getData } from '../workoutStorage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'

interface Workout {
  id: string
  workout: string
  time: string
  comments: string
  details: {
      gymExercise: string | undefined
      weights: number | undefined
      reps: number | undefined
      sets: number | undefined
  } | undefined
}

type Props = NativeStackScreenProps<RootStackParams, "Home">

export default function HomeScreen({route}: Props) {
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
    
    const formattedDate = `${day}.${month}.${year}`
    setSelectedDay(formattedDate);    
  }, []);

  useEffect(() => {   //get workouts for the selected day
    const getWorkouts = async () => {
      if (selectedDay !== null){
        const response = await getData(selectedDay)
        if (response) {
          setWorkouts([])
          setWorkouts((prevWorkouts) => prevWorkouts.concat(response))
        } else {
          setWorkouts([])
        }
    }}
    getWorkouts()
  }, [selectedDay])  // gets new workouts for the day everytime the selectedDay is changed

  useEffect(() => {
    if (route.params?.details) {
      const workout = {
        id: generateUniqueId(),
        workout: route.params.classification,
        time: '5 min',
        comments: '',
        details: route.params.details
      }
      handleStoreData(workout)
      setWorkouts(workouts.concat(workout))
    }
  }, [route.params?.details])

  const generateUniqueId = () => {
    return uuidv4();
  };

  const handleStoreData = async (workout: Workout) => {
    try {
      await storeData(selectedDay, workout);
      console.log('Treenit tallennettu onnistuneesti');
    } catch (error) {
      console.error('Virhe tallennuksessa:', error);
    }
}

  const showWorkouts = () => {
    if (workouts.length !== 0 && workouts[0] !== null) {
        return workouts.map((w: Workout) => 
          <View key={w.id}>
            <Text>{w.workout} {w.time}</Text>
            <Text>{w.details?.gymExercise}</Text>
          </View>)
    }
    return <Text>Ei vielä harjoituksia tälle päivälle</Text>
  }

  const handleDayChange = (day: string) => {
    const parsedDate = new Date(day); // parse date from string
    const formattedDate = `${parsedDate.getDate()}.${parsedDate.getMonth() + 1}.${parsedDate.getFullYear()}`;

    setSelectedDay(formattedDate)
  }

  return (
    <View style={{ flex: 1 }}>
      <Calendar 
        firstDay={1}  // Week starts from Monday
        onDayPress={(day) => handleDayChange(day.dateString)}
      />
      <Text>{selectedDay}</Text>
      <ScrollView>
        {showWorkouts()}
      </ScrollView>
      <Button title='Lisää harjoitus'
        onPress={() => navigation.navigate('AddWorkout')} />
    </View>
  );
}
