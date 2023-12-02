import { useState } from 'react';
import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { EXERCISEDATA } from '../Data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';

/* interface Exercise {
    id: string
    classification: string
    exercises: {
        id: string
        exercise: string
    }[]
} */

type Props = NativeStackScreenProps<RootStackParams, "GymExercises">

export default function GymExercises ({route, navigation}: Props) {
    const { exercises, classification } = route.params
    const [selectedId, setSelectedId] = useState('')
    const [selectedExercise, setSelectedExercise] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const select = (item) => {
        setSelectedId(item.id)
        setSelectedExercise(item.exercise)
        setModalVisible(true)
    }

    const renderItem = ({ item }) => {
        return (
            <Pressable onPress={() => select(item)}>
                <Text style={{backgroundColor: item.id === selectedId ? '#c0c0c0': '#f5f5f5'}}>{item.exercise}</Text>
            </Pressable>
        )
    }

    return(
        <View>
            <Modal visible={modalVisible}>
                <Text>{selectedExercise}</Text>
                <Text>Painot kg</Text>
                <TextInput />
                <Text>Toistot</Text>
                <TextInput />
                <Text>Sarjat</Text>
                <TextInput />
                <Button title="Tallenna" onPress={() => {
                    const details = {
                        gymExercise: selectedExercise,
                        weights: 12.5,
                        reps: 5,
                        sets: 4
                    }
                    navigation.navigate("Home", {details, classification})
                    setModalVisible(false)
                }} />
            </Modal>
            <FlatList
            data={exercises}
            renderItem={renderItem}
        ></FlatList>
        </View>
    )
    
}