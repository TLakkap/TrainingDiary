import { useState } from 'react';
import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'

type Props = NativeStackScreenProps<RootStackParams, "WorkoutDetails">

export default function WorkoutDetailsScreen ({route, navigation}: Props) {
    const {exercise, classification} = route.params
    const [exerciseDetails, setExerciseDetails] = useState<any[]>([])
    const [weights, setWeights] = useState('')
    const [reps, setReps] = useState('')
    const [comments, setComments] = useState('')
    const [updateMode, setUpdateMode] = useState(false)
    const [updatedIndex, setUpdatedIndex] = useState(0)
    const [updatedWeights, setUpdatedWeights] = useState('')
    const [updatedReps, setUpdatedReps] = useState('')

    const addSet = () => {
        const newSet = {
            weights: weights,
            reps: reps
        }
        setExerciseDetails([...exerciseDetails, newSet])
    }

    const editSet = (index: number) => {
        setUpdatedIndex(index)
        setUpdateMode(true)
        setUpdatedWeights(exerciseDetails[index].weights)
        setUpdatedReps(exerciseDetails[index].reps)
    }

    const deleteSet = (index: number) => {
        let updatedSet = [...exerciseDetails]
        updatedSet.splice(index, 1)
        setExerciseDetails(updatedSet)
    }

    const handleUpdate = () => {
        let updatedSet = [...exerciseDetails]
        updatedSet[updatedIndex].weights = updatedWeights
        updatedSet[updatedIndex].reps = updatedReps
        setExerciseDetails(updatedSet)
        setUpdateMode(false)
    }

    return(
        <View>
            {!updateMode &&
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
                    </View>)}
            </View>
            }
            {updateMode && 
            <View>
                <Text>Painot kg</Text>
            <TextInput
                value={updatedWeights}
                onChangeText={text => setUpdatedWeights(text)}
                keyboardType='numeric'
                placeholder='kg'/>
            <Text>Toistot</Text>
            <TextInput
                value={updatedReps}
                onChangeText={text => setUpdatedReps(text)}
                keyboardType='numeric'
                placeholder='toistot'/>
            <Button title="Tallenna muutokset" onPress={() => handleUpdate()} />
            </View>}
            {!updateMode && <View>
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
                    //setModalVisible(false)
                }} />
            </View>}
        </View>
    )
}