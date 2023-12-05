import { useState, useEffect } from 'react';
import { Text, View, Button, Pressable, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'

type Props = NativeStackScreenProps<RootStackParams, "WorkoutDetails">

export default function WorkoutDetailsScreen ({route, navigation}: Props) {
    const [exercise, setExercise] = useState('')
    const [classification, setClassification] = useState('')
    const [exerciseDetails, setExerciseDetails] = useState<any[]>([])
    const [weights, setWeights] = useState('')
    const [reps, setReps] = useState('')
    const [comments, setComments] = useState('')

    useEffect(() => {
        if (route.params?.updatedSet) {
            setExerciseDetails(route.params.updatedSet)
        } else if (route.params?.exercise && route.params?.classification){
            setClassification(route.params.classification)
            setExercise(route.params.exercise)
        }
      }, [route.params?.updatedSet, route.params?.exercise, route.params?.classification] )

    const addSet = () => {
        const newSet = {
            weights: weights,
            reps: reps
        }
        setExerciseDetails([...exerciseDetails, newSet])
    }

    const editSet = (index: number) => {
        let updatedSet = [...exerciseDetails]
        navigation.navigate("EditWorkout", {index, updatedSet})
    }

    const deleteSet = (index: number) => {
        let updatedSet = [...exerciseDetails]
        updatedSet.splice(index, 1)
        setExerciseDetails(updatedSet)
    }

    return(
        <View>
            <Text>{exercise}</Text>
            <Text>Painot kg</Text>
            <TextInput
                value={weights}
                onChangeText={text => setWeights(text)}
                keyboardType='numeric'
                placeholder='kg'/>
            <Text>Toistot</Text>
            <TextInput
                value={reps}
                onChangeText={text => setReps(text)}
                keyboardType='numeric'
                placeholder='toistot'/>
            {exerciseDetails.length !== 0 && exerciseDetails.map((ed, index) =>
                <View  key={index} style={{flexDirection: 'row'}}>
                    <Text>{ed.weights} kg {ed.reps} toistoa</Text>
                    <Pressable onPress={() => editSet(index)}>
                        <FontAwesomeIcon icon={ faPencil } />
                    </Pressable>
                    <Pressable onPress={() => deleteSet(index)}>
                        <FontAwesomeIcon icon={ faTrashCan } />
                    </Pressable>
                </View>
            )}
            <Button title="Lisää" onPress={() => addSet()} />
            <Text>Kommentit</Text>
            <TextInput 
                value={comments}
                onChangeText={text => setComments(text)}/>
            <Button title="Tallenna" onPress={() => {
                const details = {
                    gymExercise: exercise,
                    gymExerciseDetails: exerciseDetails
                }
                navigation.navigate("Home", {details, comments, classification})
            }} />
        </View>
    )
}