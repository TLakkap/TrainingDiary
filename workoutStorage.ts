import AsyncStorage from '@react-native-async-storage/async-storage';

interface Workout {
  workout: string;
  time: string;
}

export const storeData = async (date: string, workouts: Workout): Promise<void> => {
    try {
      const jsonWorkouts = JSON.stringify(workouts);
      await AsyncStorage.setItem(date, jsonWorkouts);
      console.log("jsonworkouts: ", jsonWorkouts)
    } catch (error) {
      console.error(error);
    }
  };

export const getData = async(dateToRetrieve: string) => {
    try {
      const res = await AsyncStorage.getItem(dateToRetrieve)

      if(res){
        try {
          const json = JSON.parse(res);
          console.log('json:', json);
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