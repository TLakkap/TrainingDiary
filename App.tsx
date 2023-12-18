import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import AddWorkoutScreen from './components/AddWorkoutScreen'
import ChooseExerciseScreen from './components/ChooseExerciseScreen'
import WorkoutDetailsScreen from './components/WorkoutDetailsScreen'
import EditSavedWorkout from './components/EditSavedWorkout'
import ProgressScreen from './components/ProgressScreen'

interface Workout {
  id: string
  classification: string
  comments: string
  details: {
      kms: string
      time: string
      gymExercise: string
      gymExerciseDetails: {
        weights: string
        reps: string
      }[]
  }
}

export type RootStackParams = {
  Login: undefined;
  Home: {
    details: {
      kms: string
      time: string
      gymExercise: string
      gymExerciseDetails: {
        weights: string
        reps: string
      }[]
  }
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
  }
  EditSavedWorkout: {
    workouts: Workout[]
    classification: string
    id: string
    date: string
  }
  ProgressScreen: undefined
}

const RootStack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  return (
    <NavigationContainer >
      <RootStack.Navigator initialRouteName='Home' 
        screenOptions={{ headerStyle: { backgroundColor: '#008000' }, headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
          <RootStack.Screen name='Login' component={LoginScreen} />
          <RootStack.Screen name='Home' component={HomeScreen} options={{ title: 'Kalenteri' }} />
          <RootStack.Screen name='AddWorkout' component={AddWorkoutScreen} options={{ title: 'Valitse luokka' }} />
          <RootStack.Screen name='ChooseExercise' component={ChooseExerciseScreen} options={{ title: 'Valitse harjoitus' }} />
          <RootStack.Screen name='WorkoutDetails' component={WorkoutDetailsScreen} options={{ title: 'Harjoituksen tiedot' }} />
          <RootStack.Screen name='EditSavedWorkout' component={EditSavedWorkout} options={{ title: 'Muokkaa tietoja' }} />
          <RootStack.Screen name='ProgressScreen' component={ProgressScreen} options={{ title: 'Kehityksen seuranta' }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}