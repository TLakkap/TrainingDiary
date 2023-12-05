import { useState, useEffect } from 'react';
import { Text, View, Button, ScrollView, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { storeData, getData, clearAll, updateData } from '../workoutStorage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'

interface Workout {
  id: string
  workout: string
  comments: string
  details: {
      gymExercise: string | undefined
      gymExerciseDetails: {
        weights: string
        reps: string
      }[]
  }
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

  useEffect(() => {  // storing new workout
    if (route.params?.details) {  // checking if there are details parameters from GymExercises
      const workout = {
        id: generateUniqueId(),
        workout: route.params.classification,
        comments: route.params.comments,
        details: route.params.details
      }
      handleStoreData(workout)
      setWorkouts(workouts.concat(workout))  // new workout is rendered to the screen
    }
  }, [route.params?.details])

  const generateUniqueId = () => {
    return uuidv4();
  };

  const handleStoreData = async (workout: Workout) => {
    try {
      await storeData(selectedDay, workout);
      console.log('Workout saved');
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  const handleUpdateData = async (updatedWorkouts: Workout[]) => {
    try {
      await updateData(selectedDay, updatedWorkouts);
      console.log('Workout updated');
    } catch (error) {
      console.error('Update error:', error);
    }
  }

  const deleteWorkout = async (id: string) => {
    const findWorkout = workouts.findIndex(item => item.id === id)
    if (findWorkout >= 0) {
      let updatedWorkouts = [...workouts]
      updatedWorkouts.splice(findWorkout, 1)
      await handleUpdateData(updatedWorkouts)
      setWorkouts(updatedWorkouts)
    } else {
      console.log("Invalid index")
    }
  }

  const deleteSet = async (id: string, index: number) => {
    const findWorkout = workouts.findIndex(item => item.id === id)
    if (findWorkout >= 0) {
      let updatedWorkouts = [...workouts]
      let updatedSet = updatedWorkouts[findWorkout]
      updatedSet.details.gymExerciseDetails.splice(index, 1)
      updatedWorkouts[findWorkout] = updatedSet
      await handleUpdateData(updatedWorkouts)
      setWorkouts(updatedWorkouts)
    } else {
      console.log("Invalid index")
    }
  }

  const showWorkouts = () => {
    if (workouts.length !== 0 && workouts[0] !== null) {
      return workouts.map((w: Workout) => 
        <View key={w.id}>
          {/* <Text>{w.workout}</Text> */}
          <View style={{flexDirection: 'row', margin: 2}}>
          <Text>{w.details?.gymExercise}</Text>
          <Pressable onPress={() => deleteWorkout(w.id)}>
                <FontAwesomeIcon icon={ faTrashCan } />
          </Pressable>
          </View>
          {w.details?.gymExerciseDetails?.map((d, index) => 
            <View key={index} style={{flexDirection: 'row'}}>
              {d.weights !== '' && <Text style={{fontSize: 16}}>{d.weights} kg</Text>}
              <Text style={{fontSize: 16}}> {d.reps} toistoa </Text>
              <Pressable onPress={() => deleteSet(w.id, index)}>
                <FontAwesomeIcon icon={ faTrashCan } />
              </Pressable>
            </View>)}
          <Text>{w.comments}</Text>
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
      <Text style={{fontSize: 20, textAlign: 'center', backgroundColor: 'lightgreen', padding: 2}}>{selectedDay}</Text>
      <ScrollView>
        {showWorkouts()}
      </ScrollView>
      <Button title='Lisää harjoitus'
        onPress={() => navigation.navigate('AddWorkout')} />
      {/* <Button title="Tyhjennä kaikki" onPress={() => clearAll()} /> */}
    </View>
  );
}
