import { useState } from 'react';
import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { EXERCISEDATA } from '../Data';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'
import { storeData, getData } from '../workoutStorage'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';

interface Workout {
    id: string
    workout: string
    time: string
  }

interface Exercise {
    id: string
    exercise: string
}

type Props = NativeStackScreenProps<RootStackParams, "AddWorkout">

export default function AddWorkoutScreen ({route, navigation}: Props) {
    const selectedDay = route.params.selectedDay
    const [selectedId, setSelectedId] = useState('')
    const [selectedExercise, setSelectedExercise] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const renderItem = ({ item }: { item: Exercise}) => {
        return (
            <Pressable onPress={() => select(item)}>
                <Text style={{backgroundColor: item.id === selectedId ? '#c0c0c0': '#f5f5f5'}}>{item.exercise}</Text>
            </Pressable>
        )
    }

    const select = (item: Exercise) => {
        setSelectedId(item.id)
        setSelectedExercise(item.exercise)
        setModalVisible(true)
    }

    const generateUniqueId = () => {
        return uuidv4();
    };

    const handleStoreData = async (workout: Workout) => {
        try {
          await storeData(selectedDay, workout);
          console.log('Treenit tallennettu onnistuneesti');
        } catch (error) {
          console.error('Virhe tallennuksessa:', error);
        }
    }

    return(
        <View>
            <Modal
                visible={modalVisible}
            >
                <Text>Lisää harjoitus</Text>
                <Text>{selectedExercise}</Text>
                <Text>Kesto</Text>
                <TextInput />
                <Text>Kommentit</Text>
                <TextInput />
                <Pressable onPress={() => {
                    const workout = {
                        id: generateUniqueId(),
                        workout: selectedExercise,
                        time: '5 min'
                    }
                    handleStoreData(workout)
                    setModalVisible(false)
                }}>
                    <Text>Tallenna</Text>
                </Pressable>
            </Modal>
            <FlatList
                data={EXERCISEDATA}
                renderItem={renderItem}
            ></FlatList>
        </View>
    )

}