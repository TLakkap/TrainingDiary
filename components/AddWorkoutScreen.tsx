import { FlatList, Text, View, Pressable } from 'react-native';
import { EXERCISEDATA } from '../Data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import StyleSheet from '../Styles'

interface Exercise {
    id: string
    classification: string
    exercises: {
        id: string
        exercise: string
    }[]
}

type Props = NativeStackScreenProps<RootStackParams, "AddWorkout">

export default function AddWorkoutScreen ({navigation}: Props) {

    const renderItem = ({ item }: { item: Exercise}) => {
        return (
            <Pressable onPress={() => select(item)}>
                <Text style={StyleSheet.flatlistElement}>{item.classification}</Text>
            </Pressable>
        )
    }

    const select = (item: Exercise) => {
        const classification = item.classification
        const exercises = item.exercises
        navigation.navigate('ChooseExercise', {exercises, classification})
    }

    return(
        <View>
            <FlatList
                data={EXERCISEDATA}
                renderItem={renderItem}
            ></FlatList>
        </View>
    )
}