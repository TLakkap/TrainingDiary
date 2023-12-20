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

    
      console.log("progressData:", progressData)

    if(progressData !== undefined){
        progressData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = {
        labels: progressData.map(item => item.date),
        datasets: [
          {
            data: progressData.map(item => item.weights),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Viivan väri
            strokeWidth: 2 // Viivan paksuus
          }
        ]
      };

    return(
        <View style={styles.container}>
        <LineChart
        data={chartData}
        width={350}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#8670F4'
          }
        }}
        bezier
        style={styles.chart}
      />
      <View style={styles.axisContainer}>
        {progressData.map((item, index) => (
          <Text key={index} style={styles.axisText}>
            {item.date}
          </Text>
        ))}
      </View>
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
        marginVertical: 8,
        borderRadius: 16,
      },
      axisContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingTop: 10,
      },
      axisText: {
        fontSize: 12,
        color: 'black',
      },
  });