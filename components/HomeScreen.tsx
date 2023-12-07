import { useState, useEffect } from 'react';
import { Text, View, Button, ScrollView, Pressable } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker'
import { storeData, getData, updateData, getWorkoutsForMonth } from '../workoutStorage'
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
  const [date, setDate] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedYear, setSelectedYear] = useState(0)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [monthlyWorkouts, setMonthlyWorkouts] = useState<{ date: string; workouts: string[]; }[]>([])
  const monthNames = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu']
  const dayNamesShort = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']

  useEffect(() => {     // Set today to selected day
      if(date === ''){
        const today = new Date()
        handleDayChange(today.toString())
      }
  }, []);

  useEffect(() => {   //get workouts for the selected day
    const getWorkouts = async () => {
      if (date !== null){
        const response = await getData(date)
        if (response) {
          setWorkouts([])
          setWorkouts((prevWorkouts) => prevWorkouts.concat(response))
        } else {
          setWorkouts([])
        }
    }}
    getWorkouts()
  }, [date])  // gets new workouts for the day everytime the date is changed

  useEffect(() => {   //get workouts for the selected month
    const getWorkouts = async () => {
      if (selectedMonth !== 0){
        try {

          const response = await getWorkoutsForMonth(selectedMonth, selectedYear);
          if (response) {
            const workoutsByDate = Object.keys(response).map(date => ({
              date,
              workouts: response[date].map(workout => workout.workout)
            }));
            console.log("Tul:", workoutsByDate)
            setMonthlyWorkouts(workoutsByDate);
          } else {
            console.log("No response");
          }
        }
        catch (error) {
          console.error("Error fetching workouts:", error);
        }
    }}
    getWorkouts()
  }, [selectedMonth, selectedYear])

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
      await storeData(date, workout);
      console.log('Workout saved');
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  const handleUpdateData = async (updatedWorkouts: Workout[]) => {
    try {
      await updateData(date, updatedWorkouts);
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
    setDate(parsedDate.toISOString().split('T')[0])
    const formattedDate = `${parsedDate.getDate()}.${parsedDate.getMonth() + 1}.${parsedDate.getFullYear()}`;
    setSelectedDay(formattedDate)
    setSelectedMonth(parsedDate.getMonth() + 1)  // Months start from index 0
    setSelectedYear(parsedDate.getFullYear())
  }

  const customDatesStyles: {date: string, style: {backgroundColor: string}, textStyle: {color: string}}[] = [];
  
  monthlyWorkouts.forEach(entry => {
    const hasCardio = entry.workouts.includes('Cardio');
    const hasKuntosali = entry.workouts.includes('Kuntosali');

    let backgroundColor = '#FFFFFF'; // Default background color

    if (hasCardio && hasKuntosali) {
      backgroundColor = '#FFD700'; // Yellow for both Cardio and Kuntosali
    } else if (hasCardio) {
      backgroundColor = '#ADD8E6'; // Blue for Cardio
    } else if (hasKuntosali) {
      backgroundColor = '#FF0000'; // Red for Kuntosali
    }

    customDatesStyles.push({
      date: entry.date,
      style: { backgroundColor },
      textStyle: { color: 'black' } // Text color can be set if needed
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <CalendarPicker 
        onDateChange={(day) => handleDayChange(day.toString())}
        customDatesStyles={customDatesStyles}
        startFromMonday={true}
        weekdays={dayNamesShort}
        months={monthNames}
        previousTitle='Edellinen'
        nextTitle='Seuraava'
        selectMonthTitle='Valitse kuukausi vuodelta '
        selectYearTitle='Valitse vuosi'
      />
      <Text style={{fontSize: 20, textAlign: 'center', backgroundColor: 'lightgreen', padding: 2}}>{selectedDay}</Text>
      <ScrollView>
        {showWorkouts()}
      </ScrollView>
      <Button title='Lisää harjoitus'
        onPress={() => navigation.navigate('AddWorkout')} />
    </View>
  );
}
