import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import StyleSheet from '../Styles'

interface ExerciseItem {
    id: string;
    exercise: string;
}

type Props = NativeStackScreenProps<RootStackParams, "ChooseExercise">

export default function ChooseExerciseScreen ({route, navigation}: Props) {
    const {exercises, classification} = route.params

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
            <FlatList
            data={exercises}
            renderItem={renderItem}
        ></FlatList>
        </View>
    )   
}