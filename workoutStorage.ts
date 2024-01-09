import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

export const storeProgressData =async (date: string, gymExercise: string, weights: string) => {
  try {
    let existingProgress: any = []
    const existingData = await AsyncStorage.getItem(gymExercise)

    if(existingData) {
      const jsonExisting = JSON.parse(existingData)
      existingProgress = existingProgress.concat(jsonExisting)
    }

    const newProgress = {date: date, weights: weights}

    const updatedProgress = [...existingProgress, newProgress]
    const jsonProgress = JSON.stringify(updatedProgress);
    await AsyncStorage.setItem(gymExercise, jsonProgress);
  } catch (error) {
    console.error(error);
  }
}

export const storeUpdatedProgressData = async (gymExercise: string, updatedProgress: any[]) => {
  try {
    const jsonProgress = JSON.stringify(updatedProgress);
    await AsyncStorage.setItem(gymExercise, jsonProgress);
  } catch (error) {
    console.error(error);
  }
}

export const getProgress = async(gymExercise: string) => {
  try {
    const res = await AsyncStorage.getItem(gymExercise)

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

  export const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('Done.')
  }