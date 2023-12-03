import AsyncStorage from '@react-native-async-storage/async-storage';

interface Workout {
  id: string;
  workout: string;
  comments: string;
  details: {
    gymExercise: string | undefined
    gymExerciseDetails: {
      weights: string
      reps: string
    }[]
  }
}

export const storeData = async (date: string, newWorkout: Workout): Promise<void> => {
    try {
      let existingWorkouts: Workout[] = []
      const existingData = await AsyncStorage.getItem(date)

      if(existingData) {
        const jsonExisting = JSON.parse(existingData)
        existingWorkouts = existingWorkouts.concat(jsonExisting)
      }

      const updatedWorkouts = [...existingWorkouts, newWorkout]
      const jsonWorkouts = JSON.stringify(updatedWorkouts);
      await AsyncStorage.setItem(date, jsonWorkouts);
    } catch (error) {
      console.error(error);
    }
  };

export const getData = async(dateToRetrieve: string): Promise<Workout[] | null> => {
    try {
      const res = await AsyncStorage.getItem(dateToRetrieve)

      if(res){
        try {
          const json = JSON.parse(res);
          return json;
        } catch (error) {
          console.error('Invalid JSON:', error);
          return null;
        }
      } else {
        console.log('Data is null or undefined.');
        return null;
      }
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
      }
  }

export const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    console.log(e)
  }

  console.log('Done.')
}