import { useState, useEffect } from 'react';
import { Text, View, Button, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { storeData, getData, updateData, getWorkoutsForMonth, clearAll } from '../workoutStorage'
import { RootStackParams } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import Calendar from './Calendar';
import StyleSheet from '../Styles'

interface Workout {
  id: string
  classification: string
  comments: string
  details: {
      kms: string | undefined
      time: string | undefined
      gymExercise: string
      gymExerciseDetails: {
        weights: string | undefined
        reps: string | undefined
      }[] | undefined
  }
}

type Props = NativeStackScreenProps<RootStackParams, "Home">

export default function HomeScreen({route, navigation}: Props) {
  const [date, setDate] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedYear, setSelectedYear] = useState(0)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [monthlyWorkouts, setMonthlyWorkouts] = useState<{ date: string; monthWorkouts: string[]; }[]>([])
  const [showDetails, setShowDetails] = useState<string>()

  useEffect(() => {     // Set today to selected day
      if(date === ''){
        const today = new Date()
        handleDayChange(today.toString())
      }
  }, []);

  useEffect(() => {
    if (route.params?.updatedWorkouts) {
      setWorkouts(route.params.updatedWorkouts);
    }
  }, [route.params?.updatedWorkouts]);

  useEffect(() => {   //get workouts for the selected day
    const getWorkouts = async () => {
      if (date !== null){
        const response = await getData(date)
        if (response) {
          console.log(response)
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
              monthWorkouts: response[date].map(workout => workout.classification)
            }))
            setMonthlyWorkouts(workoutsByDate);
          } else {
            console.log("No response")
          }
        }
        catch (error) {
          console.error("Error fetching workouts:", error)
        }
    }}
    getWorkouts()
  }, [selectedMonth, selectedYear])

  useEffect(() => {  // storing new workout
    if (route.params?.details) {  // checking if there are details parameters from GymExercises
      const workout = {
        id: generateUniqueId(),
        classification: route.params.classification,
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
      updatedSet.details.gymExerciseDetails?.splice(index, 1)
      updatedWorkouts[findWorkout] = updatedSet
      await handleUpdateData(updatedWorkouts)
      setWorkouts(updatedWorkouts)
    } else {
      console.log("Invalid index")
    }
  }

  const handleWorkoutPress = (pressedWorkout: string) => {
    if (pressedWorkout === showDetails) {
      setShowDetails('')
    } else {
      setShowDetails(pressedWorkout)
    }
  }

  const editSavedWorkout = (id: string, classification: string) => {
    navigation.navigate("EditSavedWorkout", {workouts, classification, id, date})
  }

  const workoutHeader = (details: any, id: string, classification: string, exercise: string) => (
    <View style={StyleSheet.workoutHeader}>
      <Pressable onPress={() => handleWorkoutPress(details.gymExercise)}>
        <Text style={StyleSheet.workoutHeaderText}>{details.gymExercise}</Text>
      </Pressable>
      <Pressable onPress={() => editSavedWorkout(id, classification)} >
          <FontAwesomeIcon icon={ faPencil } />
      </Pressable>
      <Pressable style={StyleSheet.workoutHeaderText} onPress={() => deleteWorkout(id)}>
        <FontAwesomeIcon size={22} icon={ faTrashCan } />
      </Pressable>
    </View>
  )

  const showCardio = (id: string, details: any) => {
  return (
    <View style={(details.kms !== '0' || details.time !== '0') ? StyleSheet.listElement : null}>
      {details.kms !== '0' && <Text>{details.kms} km</Text>}
      {details.time !== '0' && <Text>{details.time} min</Text>}
    </View>
  )}

  const showGym = (d: any, index: number, id: string) => (
    <View key={index} style={StyleSheet.listElement}>
      {d.weights !== '' && <Text> {d.weights} kg</Text>}
      {d.reps !== '' && <Text> {d.reps} toistoa </Text>}
      <Pressable onPress={() => deleteSet(id, index)}>
        <FontAwesomeIcon icon={ faTrashCan } />
      </Pressable>
    </View>
  )

  const showWorkouts = () => {
    if (workouts.length !== 0 && workouts[0] !== null) {
      return workouts.map((w: Workout) => 
        <View key={w.id}>
          {workoutHeader(w.details, w.id, w.classification, w.details.gymExercise)}
            {showDetails === w.details.gymExercise &&
              <View>
                {showCardio(w.id, w.details)}
                {w.details.gymExerciseDetails?.map((d, index) =>
                  showGym(d, index, w.id)
                )}
                <Text style={StyleSheet.comments}>{w.comments}</Text>
              </View>
            }
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

  return (
    <View style={StyleSheet.container}>
      <View style={StyleSheet.calendar}>
        <Calendar handleDayChange={handleDayChange} monthlyWorkouts={monthlyWorkouts} setSelectedMonth={setSelectedMonth} />
      </View>
      <Text style={StyleSheet.day}>{selectedDay}</Text>
      <ScrollView>
        {showWorkouts()}
      </ScrollView>
        <Pressable style={StyleSheet.pressableButton}
          onPress={() => navigation.navigate('AddWorkout')}>
            <Text style={StyleSheet.pressableText}>Lisää harjoitus</Text>
        </Pressable>
        <Button title='Tyhjennä' onPress={() => clearAll()} />
    </View>
  );
}


