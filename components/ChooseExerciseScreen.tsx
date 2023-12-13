import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import StyleSheet from '../Styles'
import Search from './Search';
import { useEffect, useState } from 'react';

interface ExerciseItem {
    id: string;
    exercise: string;
}

type Props = NativeStackScreenProps<RootStackParams, "ChooseExercise">

export default function ChooseExerciseScreen ({route, navigation}: Props) {
    const {exercises, classification} = route.params
    const [items, setItems] = useState<ExerciseItem[]>()

    useEffect(() => {
        setItems(exercisesSorted)
    }, [])

    const exercisesSorted = exercises.sort((a, b) => {  // exercises to alphabetical order
        return a.exercise.localeCompare(b.exercise)
    })

    const executeSearch = (search: string) => {
        const searchArray = exercisesSorted.filter((item) => item.exercise.startsWith(search))
        setItems(searchArray)
    }

    const renderItem = ({ item }: {item: ExerciseItem}) => {
        return (
            <Pressable onPress={() => select(item)}>
                <Text style={StyleSheet.flatlistElement}>{item.exercise}</Text>
            </Pressable>
        )
    }

    const select = (item: {id: string, exercise: string}) => {
        const id = item.id
        const exercise = item.exercise
        navigation.navigate('WorkoutDetails', {exercise, classification})
    }

    return(
        <View>
            <Search executeSearch={executeSearch} />
            <FlatList
            data={items}
            renderItem={renderItem}
        ></FlatList>
        </View>
    )   
}