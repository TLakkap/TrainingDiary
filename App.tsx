import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import AddWorkoutScreen from './components/AddWorkoutScreen'
import ChooseExerciseScreen from './components/ChooseExerciseScreen'
import WorkoutDetailsScreen from './components/WorkoutDetailsScreen'
import EditSavedWorkout from './components/EditSavedWorkout'

interface Workout {
  id: string
  classification: string
  comments: string
  details: {
      kms: string | undefined
      time: string | undefined
      gymExercise: string
      gymExerciseDetails: {
        weights: string | undefined
        reps: string | undefined
      }[] | undefined
  }
}

export type RootStackParams = {
  Login: undefined;
  Home: {
    details: {
      kms: string | undefined
      time: string | undefined
      gymExercise: string
      gymExerciseDetails: {
        weights: string | undefined
        reps: string | undefined
      }[] | undefined
  } | undefined
    classification: string
    comments: string
    updatedWorkouts: Workout[]
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
  EditSavedWorkout: {
    workouts: Workout[]
    classification: string
    id: string
    date: string
  }
}

const RootStack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  return (
    <NavigationContainer >
      <RootStack.Navigator initialRouteName='Login' 
        screenOptions={{ headerStyle: { backgroundColor: '#008000' }, headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
          <RootStack.Screen name='Login' component={LoginScreen} />
          <RootStack.Screen name='Home' component={HomeScreen} />
          <RootStack.Screen name='AddWorkout' component={AddWorkoutScreen} />
          <RootStack.Screen name='ChooseExercise' component={ChooseExerciseScreen} />
          <RootStack.Screen name='WorkoutDetails' component={WorkoutDetailsScreen} />
          <RootStack.Screen name='EditSavedWorkout' component={EditSavedWorkout} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}