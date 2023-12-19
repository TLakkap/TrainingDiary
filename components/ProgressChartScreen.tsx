import { Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import StyleSheet from '../Styles'
import { useEffect, useState } from 'react';
import { EXERCISEDATA } from '../Data';
import { getProgress } from '../workoutStorage'

interface ExerciseItem {
    id: string;
    exercise: string;
}

type Props = NativeStackScreenProps<RootStackParams, "ProgressChartScreen">

export default function ProgressChartScreen ({ route, navigation }: Props) {
    useEffect(() => {
        const gymExercise = route.params.exercise
        const getWorkouts = async () => {
            if (gymExercise !== null){
              const response = await getProgress(gymExercise)
              if (response) {
                console.log(response)
                //setIsLoading(false)
              } else {
                console.log("Ei tietoja")
              }
        }}
        getWorkouts()
    }, [])

    return(
        <Pressable onPress={() => navigation.navigate('ProgressScreen')}>
            <Text>
                Takaisin
            </Text>
        </Pressable>
    )
}