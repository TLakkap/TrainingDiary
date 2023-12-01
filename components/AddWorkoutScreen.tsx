import { useState } from 'react';
import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { EXERCISEDATA } from '../Data';

interface Exercise {
    id: string
    exercise: string
}

export default function AddTrainingScreen() {
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