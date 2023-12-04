import { useState } from 'react';
import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';

interface ExerciseItem {
    id: string;
    exercise: string;
}

type Props = NativeStackScreenProps<RootStackParams, "GymExercises">

export default function GymExercises ({route, navigation}: Props) {
    const {exercises, classification} = route.params
    const [selectedId, setSelectedId] = useState('')
    const [selectedExercise, setSelectedExercise] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [exerciseDetails, setExerciseDetails] = useState<any[]>([])
    const [weights, setWeights] = useState('')
    const [reps, setReps] = useState('')
    const [updateMode, setUpdateMode] = useState(false)
    const [updatedIndex, setUpdatedIndex] = useState(0)
    const [updatedWeights, setUpdatedWeights] = useState('')
    const [updatedReps, setUpdatedReps] = useState('')

    const select = (item: {id: string, exercise: string}) => {
        setSelectedId(item.id)
        setSelectedExercise(item.exercise)
        setModalVisible(true)
    }

    const renderItem = ({ item }: {item: ExerciseItem}) => {
        return (
            <Pressable onPress={() => select(item)}>
                <Text>{item.exercise}</Text>
            </Pressable>
        )
    }

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

    const handleUpdate = () => {
        let updatedSet = [...exerciseDetails]
        updatedSet[updatedIndex].weights = updatedWeights
        updatedSet[updatedIndex].reps = updatedReps
        setExerciseDetails(updatedSet)
        setUpdateMode(false)
    }

    return(
        <View>
            <Modal visible={modalVisible}>
                {!updateMode &&
                <View>
                    <Text>{selectedExercise}</Text>
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
                        <View>
                            <Text key={index}>{ed.weights} kg {ed.reps} toistoa</Text>
                            <Button title="Muokkaa" onPress={() => editSet(index)} />
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
                    <Button title="Tallenna" onPress={() => {
                        const details = {
                            gymExercise: selectedExercise,
                            gymExerciseDetails: exerciseDetails
                        }
                        navigation.navigate("Home", {details, classification})
                        setModalVisible(false)
                    }} />
                </View>}
            </Modal>
            <FlatList
            data={exercises}
            renderItem={renderItem}
        ></FlatList>
        </View>
    )   
}