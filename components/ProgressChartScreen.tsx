import { Text, View, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
//import StyleSheet from '../Styles'
import { useEffect, useState } from 'react';
import { EXERCISEDATA } from '../Data';
import { getProgress } from '../workoutStorage'
//import { LineChart, Grid } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';

interface Progress {
    date: string;
    weights: string;
}

type Props = NativeStackScreenProps<RootStackParams, "ProgressChartScreen">

export default function ProgressChartScreen ({ route, navigation }: Props) {
    const [progressData, setProgressData] = useState<Progress[]>()

    useEffect(() => {
        const gymExercise = route.params.exercise
        const getWorkouts = async () => {
            if (gymExercise !== null){
              const response = await getProgress(gymExercise)
              if (response) {
                console.log(response)
                setProgressData(response)
              } else {
                console.log("Ei tietoja")
              }
        }}
        getWorkouts()
    }, [])

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
        <View style={styles.container}>
        <Text>{route.params.exercise}</Text>
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
            style={styles.chart}
        />
        <Pressable onPress={() => navigation.navigate('ProgressScreen')}>
            <Text>
                Takaisin
            </Text>
        </Pressable>
        </View>
    )} else {
        return(
            <Text>Nothing to see here</Text>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
      },
      chart: {
        marginVertical: 20,
        borderRadius: 16,
      },
  });