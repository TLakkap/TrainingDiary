import { FlatList, Text, View, Button, Pressable, Modal, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';

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
                <Text style={{fontSize: 22, padding: 4, borderWidth: 1, borderColor: 'black'}}>{item.exercise}</Text>
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