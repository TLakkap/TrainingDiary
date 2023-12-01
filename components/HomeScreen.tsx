import { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { storeData, getData } from '../workoutStorage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define Stack-parameters
type RootStackParamList = {
  AddWorkout: undefined;
};

// Define types for props
type AddWorkoutScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddWorkout'>;
};

interface Workout {
  workout: string;
  time: string;
}

export default function HomeScreen({ navigation }: AddWorkoutScreenProps) {
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
    { workout: 'juoksu', time: '30 min' },
    { workout: 'voimaharjoittelu', time: '45 min' },
  ];

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

  useEffect(() => {   //get trainings for the selected day
    const getTrainings = (async () => {
      const response = await getData(selectedDay)
      setTrainings(response)
    })
    getTrainings()
  }, [selectedDay])  // gets new trainings for the day everytime the selectedDay is changed

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
        return trainings.map((t: Workout) => <Text>{t.workout}</Text>)
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
      {showTrainings()}
      <Button title='Lisää harjoitus' onPress={() => navigation.navigate('AddWorkout')} />
    </View>
  );
}
