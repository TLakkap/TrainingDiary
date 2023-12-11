import { useEffect, useState } from 'react';
import { Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import { updateData } from '../workoutStorage'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
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

type Props = NativeStackScreenProps<RootStackParams, "EditSavedWorkout">

export default function EditSavedWorkout({route, navigation}: Props) {
    let updatedWorkouts = [...route.params.workouts]
    const classification = route.params.classification
    const date = route.params.date
    const id = route.params.id
    const [exerciseDetails, setExerciseDetails] = useState<any[]>([])
    const [weights, setWeights] = useState('')
    const [reps, setReps] = useState('')
    const [comments, setComments] = useState('')
    const [kms, setKms] = useState('0')
    const [time, setTime] = useState('0')
    const [updateMode, setUpdateMode] = useState(false)
    const [updateIndex, setUpdateIndex] = useState<number>(0)


    const foundWorkoutIndex = updatedWorkouts.findIndex(w => w.id === id)

    useEffect(()=> {
        if(classification === "Kuntosali"){
            setExerciseDetails(updatedWorkouts[foundWorkoutIndex].details.gymExerciseDetails)
        } else if(classification === "Cardio"){
            setKms(updatedWorkouts[foundWorkoutIndex].details.kms)
            setTime(updatedWorkouts[foundWorkoutIndex].details.time)
        }
        setComments(updatedWorkouts[foundWorkoutIndex].comments)
    }, [])

    const handleUpdateData = async (updatedWorkouts: Workout[]) => {
        try {
          await updateData(date, updatedWorkouts);
          console.log('Workout updated');
        } catch (error) {
          console.error('Update error:', error);
        }
      }

    const handleSavePress = () => {
        updatedWorkouts[foundWorkoutIndex].comments = comments
        updatedWorkouts[foundWorkoutIndex].details = {
            kms: kms,
            time: time,
            gymExercise: updatedWorkouts[foundWorkoutIndex].details.gymExercise,
            gymExerciseDetails: exerciseDetails
        }
        handleUpdateData(updatedWorkouts)

        navigation.goBack()
        navigation.navigate('Home', { updatedWorkouts })}


    const addSet = () => {
        let updatedSet = [...exerciseDetails]
        updatedSet[updateIndex].weights = weights
        updatedSet[updateIndex].reps = reps
        setExerciseDetails(updatedSet)

        setUpdateMode(false)
    }

    const editSet = (index: number) => {
        setUpdateMode(true)
        setUpdateIndex(index)
        setWeights(exerciseDetails[index].weights)
        setReps(exerciseDetails[index].reps)
    }

    const deleteSet = (index: number) => {
        let updatedSet = [...exerciseDetails]
        updatedSet.splice(index, 1)
        setExerciseDetails(updatedSet)
    }

    const gymDetails = () => {
        return(
            <View>
                {updateMode && <View>
                    <Text style={StyleSheet.largeText}>Painot kg</Text>
                    <TextInput style={StyleSheet.input}
                        value={weights}
                        onChangeText={text => setWeights(text)}
                        keyboardType='numeric'
                        placeholder='kg'/>
                    <Text style={StyleSheet.largeText}>Toistot</Text>
                    <TextInput style={StyleSheet.input}
                        value={reps}
                        onChangeText={text => setReps(text)}
                        keyboardType='numeric'
                        placeholder='toistot'/>
                </View>}
            {exerciseDetails.length !== 0 && 
            exerciseDetails.map((ed, index) =>
                <View key={index} style={StyleSheet.listElement}>
                    <Text>{ed.weights} kg</Text>
                    <Text>x{ed.reps}</Text>
                    {!updateMode && <View style={{ flexDirection: 'row'}}> 
                        <Pressable onPress={() => editSet(index)}>
                            <FontAwesomeIcon icon={ faPencil } />
                        </Pressable>
                        <Pressable onPress={() => deleteSet(index)}>
                            <FontAwesomeIcon icon={ faTrashCan } />
                        </Pressable>
                    </View>}
                </View>
            )}
            <Text style={StyleSheet.largeText}>Kommentit</Text>
            <TextInput 
                value={comments}
                onChangeText={text => setComments(text)}/>
            {updateMode && <Pressable style={StyleSheet.pressableButton} 
                onPress={() => addSet()} >
                <Text style={StyleSheet.pressableText}>Päivitä</Text>
            </Pressable>}
            </View>
        )
    }

    const cardioDetails = () => {
        return(
            <View>
                <Text>Matka (km)</Text>
            <TextInput style={StyleSheet.input}
                value={kms}
                onChangeText={text => setKms(text)}
                keyboardType='numeric'
                placeholder='km'/>
            <Text>Aika (min)</Text>
            <TextInput style={StyleSheet.input}
                value={time}
                onChangeText={text => setTime(text)}
                keyboardType='numeric'
                placeholder='minutes'/>
            <Text>Kommentit</Text>
            <TextInput style={StyleSheet.input}
                value={comments}
                onChangeText={text => setComments(text)}/>
            </View>
        )
    }

    const stretchDetails = () => {
        return(
            <View>
            <Text>Aika (min)</Text>
            <TextInput style={StyleSheet.input}
                value={time}
                onChangeText={text => setTime(text)}
                keyboardType='numeric'
                placeholder='minutes'/>
            <Text>Kommentit</Text>
            <TextInput style={StyleSheet.input}
                value={comments}
                onChangeText={text => setComments(text)}/>
            </View>
        )
    }

    return(
        <ScrollView>
            <Text style={[StyleSheet.workoutHeader, StyleSheet.workoutHeaderText]}>{updatedWorkouts[foundWorkoutIndex].details.gymExercise}</Text>
            {classification === "Kuntosali" && gymDetails()}
            {classification === "Cardio" && cardioDetails()}
            {classification === "Muu" && cardioDetails()}
            {classification === "Kehonhuolto" && stretchDetails()}
            {!updateMode && <View>
                <Pressable style={StyleSheet.pressableButton} onPress={() => handleSavePress()}>
                    <Text style={StyleSheet.pressableText}>Tallenna</Text>
                </Pressable>
            </View>}
        </ScrollView>
    )        
}   