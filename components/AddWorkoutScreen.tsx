import { useEffect, useState } from 'react';
import { FlatList, Text, View, Pressable } from 'react-native';
import { EXERCISEDATA } from '../Data';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';

interface Exercise {
    id: string
    classification: string
    exercises: {
        id: string
        exercise: string
    }[]
}

type Props = NativeStackScreenProps<RootStackParams, "AddWorkout">

export default function AddWorkoutScreen ({route, navigation}: Props) {
   /*  const [selectedId, setSelectedId] = useState('')
    const [selectedClassification, setSelectedClassification] = useState('') */
    
   /*  useEffect(() => {
        if (route.params?.exerciseDetails) {
            const details = route.params.exerciseDetails
            navigation.navigate('Home', {details, selectedClassification})
        }
    }, [route.params?.exerciseDetails]) */

    const renderItem = ({ item }: { item: Exercise}) => {
        return (
            <Pressable onPress={() => select(item)}>
                <Text>{item.classification}</Text>
                {/* <Text style={{backgroundColor: item.id === selectedId ? '#c0c0c0': '#f5f5f5'}}>{item.classification}</Text> */}
            </Pressable>
        )
    }

    const select = (item: Exercise) => {
        /* setSelectedId(item.id)
        setSelectedClassification(item.classification) */
        const classification = item.classification
        const exercises = item.exercises
        navigation.navigate('GymExercises', {exercises, classification})
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