import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import AddWorkoutScreen from './components/AddWorkoutScreen';
import GymExercises from './components/GymExercises'

export type RootStackParams = {
  Login: undefined;
  Home: {
    details: {
      gymExercise: string,
      weights: number,
      reps: number,
      sets: number
    } | undefined;
    classification: string
  }
  AddWorkout: undefined
  GymExercises: {
    exercises: {
      id: string
      exercise: string
    }[]
    classification: string
  }
}

const RootStack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName='Login'>
        <RootStack.Screen name='Login' component={LoginScreen} />
        <RootStack.Screen name='Home' component={HomeScreen} />
        <RootStack.Screen name='AddWorkout' component={AddWorkoutScreen} />
        <RootStack.Screen name='GymExercises' component={GymExercises} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */
