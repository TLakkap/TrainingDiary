import { Text, View, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import StyleSheet from '../Styles'
import { useEffect, useState } from 'react';
import { getProgress } from '../workoutStorage'
import { LineChart } from 'react-native-chart-kit';

interface Progress {
    date: string;
    weights: string;
}

type Props = NativeStackScreenProps<RootStackParams, "ProgressChartScreen">

export default function ProgressChartScreen ({ route, navigation }: Props) {
    const [progressData, setProgressData] = useState<Progress[]>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        const gymExercise = route.params.exercise
        const getWorkouts = async () => {
            if (gymExercise !== null){
              const response = await getProgress(gymExercise)
              if (response) {
                setProgressData(response)
                setIsLoading(false) 
              } else {
                console.log("No exercises")
                setIsLoading(false)
              }
        }}
        getWorkouts()
    }, [])

    if(isLoading) {
        return( <ActivityIndicator size="large" color="#00ff00" />)
      }

    if(progressData !== undefined){
        progressData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let dates = progressData.map(item => new Date(item.date))
        const formattedDates = dates.map(d => `${d.getDate()}.${d.getMonth() + 1}`)

    const chartData = {
        labels: formattedDates,
        datasets: [
          {
            data: progressData.map(item => parseFloat(item.weights)),
            color: (opacity = 1) => `rgba(00, 200, 00, ${opacity})`, // Line color
            strokeWidth: 2
          }
        ]
      };

    return(
        <View>
            <Text style={[StyleSheet.workoutHeader, StyleSheet.workoutHeaderText]}>{route.params.exercise}</Text>
        <View style={StyleSheet.chartContainer}>
        <LineChart
            data={chartData}
            width={390}
            height={220}
            yAxisSuffix=' kg'
            chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: '2',
                    strokeWidth: '1',
                    stroke: '#008000'
                }
            }}
            style={StyleSheet.chart}
        />
        </View>
        <Pressable 
            style={StyleSheet.pressableButton} 
            onPress={() => navigation.navigate('ProgressScreen')}>
            <Text style={StyleSheet.pressableText}>
                Takaisin
            </Text>
        </Pressable>
        </View>
    )} else {
        return(
            <Text>Ei tallennettuja harjoituksia</Text>
        )
    }
}
