import { useState } from 'react';
import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'

interface ExerciseItem {
    id: string;
    exercise: string;
}

type Props = NativeStackScreenProps<RootStackParams, "ChooseExercise">

export default function ChooseExerciseScreen ({route, navigation}: Props) {
    const {exercises, classification} = route.params
    //const [selectedId, setSelectedId] = useState('')
    //const [selectedExercise, setSelectedExercise] = useState('')
    //const [modalVisible, setModalVisible] = useState(false)

    const select = (item: {id: string, exercise: string}) => {
        const id = item.id
        const exercise = item.exercise
        navigation.navigate('WorkoutDetails', {exercise, classification})
        //setModalVisible(true)
    }

    const renderItem = ({ item }: {item: ExerciseItem}) => {
        return (
            <Pressable onPress={() => select(item)}>
                <Text style={{fontSize: 22, padding: 4, borderWidth: 1, borderColor: 'black'}}>{item.exercise}</Text>
            </Pressable>
        )
    }

    return(
        <View>
            <FlatList
            data={exercises}
            renderItem={renderItem}
        ></FlatList>
        </View>
    )   
}