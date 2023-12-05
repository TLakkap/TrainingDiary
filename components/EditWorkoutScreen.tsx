import { useEffect, useState } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';

type Props = NativeStackScreenProps<RootStackParams, "EditWorkout">

export default function EditWorkoutScreen ({route, navigation}: Props) {
    const {index, updatedSet} = route.params
    const [updatedWeights, setUpdatedWeights] = useState('')
    const [updatedReps, setUpdatedReps] = useState('')

    useEffect(() => {
        setUpdatedWeights(updatedSet[index].weights)
        setUpdatedReps(updatedSet[index].reps)
    }, [])

    const handleUpdate = () => {
        updatedSet[index].weights = updatedWeights
        updatedSet[index].reps = updatedReps
        navigation.navigate('WorkoutDetails', {updatedSet})
    }

    return(
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
        </View>
    )
}