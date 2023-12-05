import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import AddWorkoutScreen from './components/AddWorkoutScreen'
import ChooseExerciseScreen from './components/ChooseExerciseScreen'
import WorkoutDetailsScreen from './components/WorkoutDetailsScreen'
import EditWorkoutScreen from './components/EditWorkoutScreen'

export type RootStackParams = {
  Login: undefined;
  Home: {
    details: {
      gymExercise: string | undefined
      gymExerciseDetails: {
        weights: string
        reps: string
      }[]
  } | undefined
    classification: string
    comments: string
  }
  AddWorkout: undefined
  ChooseExercise: {
    exercises: {
      id: string
      exercise: string
    }[]
    classification: string
  }
  WorkoutDetails: {
    exercise: string
    classification: string
    updatedSet: {
      weights: string
      reps: string
    }[]
  }
  EditWorkout: {
    index: number
    updatedSet: {
      weights: string
      reps: string
    }[]
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
          <RootStack.Screen name='ChooseExercise' component={ChooseExerciseScreen} />
          <RootStack.Screen name='WorkoutDetails' component={WorkoutDetailsScreen} />
          <RootStack.Screen name='EditWorkout' component={EditWorkoutScreen} />
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
