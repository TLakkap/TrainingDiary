import { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, Button, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { storeData, getData, updateData, getWorkoutsForMonth, clearAll, storeProgressData, getProgress, storeUpdatedProgressData } from '../workoutStorage'
import { RootStackParams } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import Calendar from './Calendar';
import StyleSheet from '../Styles'

interface Workout {
  id: string
  classification: string
  comments: string
  details: {
      kms: string
      time: string
      gymExercise: string
      gymExerciseDetails: {
        weights: string
        reps: string
      }[]
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
  const [isLoading, setIsLoading] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('ProgressScreen')}>
          <FontAwesomeIcon size={24} color='white' icon={ faChartLine } />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {     // Set today to selected day
    setIsLoading(true)  
    if(date === ''){
      const today = new Date()
      handleDayChange(today.toString())
    }
  }, []);

  useEffect(() => {   // update homescreen after workout has been updated
    if (route.params?.updatedWorkouts) {
      setWorkouts(route.params.updatedWorkouts);
    }
  }, [route.params?.updatedWorkouts]);

  useEffect(() => {   //get workouts for the selected day
    const getWorkouts = async () => {
      if (date !== null){
        const response = await getData(date)
        if (response) {
          setWorkouts([])
          setWorkouts((prevWorkouts) => prevWorkouts.concat(response))
          setIsLoading(false)
        } else {
          setIsLoading(false)
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
              monthWorkouts: response[date].map(workout => workout.classification)  // "Kuntosali", "Cardio" etc. used to get right colors in calendar
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
  }, [selectedMonth, selectedYear, workouts])

  useEffect(() => {  // storing new workout
    if (route.params?.details) {
      const workout = {
        id: generateUniqueId(),
        classification: route.params.classification,
        comments: route.params.comments,
        details: route.params.details
      }
      handleStoreData(workout)
      setWorkouts(workouts.concat(workout))  // new workout is rendered to the screen
      if (route.params.classification === "Kuntosali") {
        const gymExerciseDetails = route.params.details.gymExerciseDetails
        const maxWeights = gymExerciseDetails?.reduce((max, exercise) => {
          return (exercise.weights > max) ? exercise.weights : max
        }, gymExerciseDetails[0].weights)
        storeProgress(route.params.details.gymExercise, maxWeights)
      }
    }
  }, [route.params?.details])

  const generateUniqueId = () => {
    return uuidv4();
  };

  const handleStoreData = async (workout: Workout) => {
    try {
      await storeData(date, workout)
      console.log('Workout saved')
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const storeProgress = async (exercise: string, maxWeights: string) => {
    console.log("weights:", maxWeights)
    try {
      await storeProgressData(date, exercise, maxWeights)
      console.log('Progress saved')
    } catch (error) {
      console.error('Progress save error:', error)
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

  const deleteWorkout = async (id: string, exercise: string) => {
    const findWorkout = workouts.findIndex(item => item.id === id)
    if (findWorkout >= 0) {
      let updatedWorkouts = [...workouts]
      const deletedWorkout = updatedWorkouts[findWorkout].details.gymExerciseDetails
      const deletedWeights = deletedWorkout.map(w => parseFloat(w.weights))
      const deletedWeight = Math.max(...deletedWeights)
      updatedWorkouts.splice(findWorkout, 1)
      await handleUpdateData(updatedWorkouts)
      setWorkouts(updatedWorkouts)
      let chartData = await getProgress(exercise)
      const deletedProgressIndex = chartData.findIndex((cd: { date: string; weights: number }) => cd.date === date && cd.weights === deletedWeight)
      chartData.splice(deletedProgressIndex, 1)
      storeUpdatedProgressData(exercise, chartData)
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

  const handleWorkoutPress = (pressedWorkout: string) => {  // Show details of a workout
    if (pressedWorkout === showDetails) {
      setShowDetails('')
    } else {
      setShowDetails(pressedWorkout)
    }
  }

  const editSavedWorkout = (id: string, classification: string) => {
    navigation.navigate("EditSavedWorkout", {workouts, classification, id, date})
  }

  const handleDayChange = (day: string) => {
    setIsLoading(true)
    const parsedDate = new Date(day); // parse date from string
    setDate(parsedDate.toISOString().split('T')[0])
    const formattedDate = `${parsedDate.getDate()}.${parsedDate.getMonth() + 1}.${parsedDate.getFullYear()}`;
    setSelectedDay(formattedDate)
    setSelectedMonth(parsedDate.getMonth() + 1)  // Months start from index 0
    setSelectedYear(parsedDate.getFullYear())
  }

  const workoutHeader = (details: any, id: string, classification: string) => (
    <View style={StyleSheet.workoutHeader}>
      <Pressable onPress={() => handleWorkoutPress(details.gymExercise)}>
        <Text style={StyleSheet.workoutHeaderText}>{details.gymExercise}</Text>
      </Pressable>
      <View style={{ flexDirection: 'row'}}>
        <Pressable style={StyleSheet.workoutHeaderText} onPress={() => editSavedWorkout(id, classification)} >
            <FontAwesomeIcon size={22} icon={ faPencil } />
        </Pressable>
        <Pressable style={StyleSheet.workoutHeaderText} onPress={() => deleteWorkout(id, details.gymExercise)}>
          <FontAwesomeIcon size={22} icon={ faTrashCan } />
        </Pressable>
      </View>
    </View>
  )

  const showCardio = (details: any) => {
  return (
    <View style={(details.kms !== '' || details.time !== '') ? StyleSheet.listElement : null}>
      {details.kms !== '' && <Text>{details.kms} km</Text>}
      {details.time !== '' && <Text>{details.time} min</Text>}
    </View>
  )}

  const showStretch = (details: any) => {
    return (
      <View style={(details.time !== '') ? StyleSheet.listElement : null}>
        {details.time !== '' && <Text>{details.time} min</Text>}
      </View>
    )}

  const showGym = (d: any, index: number, id: string) => (
    <View key={index} style={StyleSheet.listElement}>
      {d.weights !== '' && <Text> {d.weights} kg</Text>}
      {d.reps !== '' && <Text>x {d.reps} </Text>}
      <Pressable onPress={() => deleteSet(id, index)}>
        <FontAwesomeIcon icon={ faTrashCan } />
      </Pressable>
    </View>
  )

  const showWorkouts = () => {
    if(isLoading) {
      return( <ActivityIndicator size="large" color="#00ff00" />)
    }
    if (workouts.length !== 0 && workouts[0] !== null) {
      return workouts.map((w: Workout) => 
        <View key={w.id}>
          {workoutHeader(w.details, w.id, w.classification)}
            {showDetails === w.details.gymExercise &&
              <View>
                {w.classification === "Cardio" && <View>{showCardio(w.details)}</View>}
                {w.classification === "Kuntosali" && <View>{w.details.gymExerciseDetails?.map((d, index) =>
                  showGym(d, index, w.id)
                )}</View>}
                {w.classification === "Kehonhuolto" && <View>{showStretch(w.details)}</View>}
                {w.comments && <Text style={StyleSheet.comments}>{w.comments}</Text>}
              </View>
            }
        </View>)
    }
    return <Text>Ei vielä harjoituksia tälle päivälle</Text>
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


