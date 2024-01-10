import { useEffect, useRef, useState } from 'react';
import { Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import { updateData, getProgress, storeUpdatedProgressData } from '../workoutStorage'
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
    const [weights, setWeights] = useState(0)
    const [reps, setReps] = useState(0)
    const [comments, setComments] = useState('')
    const [kms, setKms] = useState('0')
    const [time, setTime] = useState('0')
    const [updateMode, setUpdateMode] = useState(false)
    const [updateIndex, setUpdateIndex] = useState<number>(0)
    const [maxWeightBefore, setMaxWeightBefore] = useState(0)

    const foundWorkoutIndex = updatedWorkouts.findIndex(w => w.id === id)

    useEffect(()=> {
        if(classification === "Kuntosali"){
            setExerciseDetails(updatedWorkouts[foundWorkoutIndex].details.gymExerciseDetails)
            const weightsBefore = updatedWorkouts[foundWorkoutIndex].details.gymExerciseDetails.map(d => parseFloat(d.weights))
            setMaxWeightBefore(Math.max(...weightsBefore))
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

    const handleSavePress = async () => {
        updatedWorkouts[foundWorkoutIndex].comments = comments
        updatedWorkouts[foundWorkoutIndex].details = {
            kms: kms,
            time: time,
            gymExercise: updatedWorkouts[foundWorkoutIndex].details.gymExercise,
            gymExerciseDetails: exerciseDetails
        }
        handleUpdateData(updatedWorkouts)

        const weightsAfter = updatedWorkouts[foundWorkoutIndex].details.gymExerciseDetails.map(d => parseFloat(d.weights))
        const maxWeightAfter = Math.max(...weightsAfter)

        if(maxWeightBefore !== maxWeightAfter) {
            let chartData = await getProgress(updatedWorkouts[foundWorkoutIndex].details.gymExercise)
            const deletedMaxIndex = chartData.findIndex((cd: { date: string; weights: number }) => cd.date === date && cd.weights === maxWeightBefore)
            chartData[deletedMaxIndex].weights = maxWeightAfter
            storeUpdatedProgressData(updatedWorkouts[foundWorkoutIndex].details.gymExercise, chartData)
        }

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

    const handleMinusWeightPress = () => {
        if(weights < 10) {setWeights(weights-1)} 
        else {setWeights(weights-2.5)}
    }
    
    const handlePlusWeightPress = () => {
        if(weights < 10){setWeights(weights+1)} 
        else {setWeights(weights+2.5)}
    }

    const handleMinusRepsPress = () => setReps(reps-1)
    const handlePlusRepsPress = () => setReps(reps+1)

    const gymDetails = () => {
        return(
            <View>
                {updateMode && <View>
                    <Text style={StyleSheet.largeText}>Painot kg</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                        <Pressable style={StyleSheet.minusButton} onPress={() => handleMinusWeightPress()}><Text style={StyleSheet.pressableValueText}>-</Text></Pressable>
                        <TextInput style={StyleSheet.input}
                            value={weights.toString()}
                            onChangeText={text => setWeights(parseFloat(text) || 0)}
                            keyboardType='numeric'
                        />
                        <Pressable style={StyleSheet.plusButton} onPress={() => handlePlusWeightPress()}><Text style={StyleSheet.pressableValueText}>+</Text></Pressable>
                    </View>
                    <Text style={StyleSheet.largeText}>Toistot</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                        <Pressable style={StyleSheet.minusButton} onPress={() => handleMinusRepsPress()}><Text style={StyleSheet.pressableValueText}>-</Text></Pressable>  
                        <TextInput style={StyleSheet.input}
                            value={reps.toString()}
                            onChangeText={text => setReps(parseInt(text) || 0)}
                            keyboardType='numeric'
                        />
                        <Pressable style={StyleSheet.plusButton} onPress={() => handlePlusRepsPress()}><Text style={StyleSheet.pressableValueText}>+</Text></Pressable>
                    </View>
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
                <Text style={StyleSheet.largeText}>Matka (km)</Text>
            <TextInput style={StyleSheet.input}
                value={kms}
                onChangeText={text => setKms(text)}
                keyboardType='numeric'
                placeholder='km'/>
            <Text style={StyleSheet.largeText}>Aika (min)</Text>
            <TextInput style={StyleSheet.input}
                value={time}
                onChangeText={text => setTime(text)}
                keyboardType='numeric'
                placeholder='minutes'/>
            <Text style={StyleSheet.largeText}>Kommentit</Text>
            <TextInput style={StyleSheet.commentsInput}
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