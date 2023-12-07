import AsyncStorage from '@react-native-async-storage/async-storage';

interface Workout {
  id: string
  workout: string
  comments: string
  details: {
      kms: string | undefined
      time: string | undefined
      gymExercise: string | undefined
      gymExerciseDetails: {
        weights: string | undefined
        reps: string | undefined
      }[] | undefined
  }
}

export const getWorkoutsForMonth = async (month: number, year: number) => {
  try {
    const workoutsForMonth: { [date: string]: Workout[] } = {};

    const startDate = new Date(year, month - 1, 1); // Months start from index 0
    const endDate = new Date(year, month, 0);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const workouts = await getData(dateString);

      if (workouts) {
        workoutsForMonth[dateString] = workouts;
      }
    }

    return workoutsForMonth;
  } catch (error) {
    console.error('Error fetching workouts for month:', error);
    return {};
  }
};

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

export const updateData = async (date: string, updatedWorkouts: Workout[]): Promise<void> => {
  try {
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
        //console.log('Data is null or undefined.');
        return null;
      }
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
      }
  }