import { useState, useEffect } from 'react';
import { Text, View, Pressable, TextInput, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import StyleSheet from '../Styles'

type Props = NativeStackScreenProps<RootStackParams, "WorkoutDetails">

export default function WorkoutDetailsScreen ({route, navigation}: Props) {
    const [exercise, setExercise] = useState('')
    const [classification, setClassification] = useState('')
    const [exerciseDetails, setExerciseDetails] = useState<any[]>([])
    const [weights, setWeights] = useState(0)
    const [reps, setReps] = useState(0)
    const [comments, setComments] = useState('')
    const [kms, setKms] = useState<string>()
    const [time, setTime] = useState<string>()
    const [updateMode, setUpdateMode] = useState(false)
    const [updateIndex, setUpdateIndex] = useState<number>(0)

    useEffect(() => {
        setClassification(route.params.classification)
        setExercise(route.params.exercise)
      }, [route.params.exercise, route.params.classification] )

    const addSet = () => {
        if(updateMode){
            let updatedSet = [...exerciseDetails]
            updatedSet[updateIndex].weights = weights
            updatedSet[updateIndex].reps = reps
            setUpdateMode(false)
        }else {
            const newSet = {
                weights: weights,
                reps: reps
            }
            setExerciseDetails([...exerciseDetails, newSet])
        }
    }

    const editSet = (index: number) => {
        setUpdateMode(true)
        setUpdateIndex(index)
        setWeights(exerciseDetails[index].weights)
        setReps(exerciseDetails[index].reps)
    }

    const deleteSet = (index: number) => {
        let updatedSet = [...exerciseDetails]
        updatedSet.splice(index, 1)
        setExerciseDetails(updatedSet)
    }

    const handleMinusWeightPress = () => {
        if(weights < 10) {setWeights(weights-1)} 
        else {setWeights(weights-2.5)}
    }
    
    const handlePlusWeightPress = () => {
        if(weights < 10){setWeights(weights+1)} 
        else {setWeights(weights+2.5)}
    }

    const handleMinusRepsPress = () => setReps(reps-1)
    const handlePlusRepsPress = () => setReps(reps+1)


    const gymDetails = () => {
        return(
            <View>
                <Text style={StyleSheet.largeText}>Painot kg</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                    <Pressable style={StyleSheet.minusButton} onPress={() => handleMinusWeightPress()}><Text style={StyleSheet.pressableValueText}>-</Text></Pressable>
                    <TextInput style={StyleSheet.input}
                        value={weights.toString()}
                        onChangeText={text => setWeights(parseFloat(text) || 0)}
                        keyboardType='numeric'
                    />
                    <Pressable style={StyleSheet.plusButton} onPress={() => handlePlusWeightPress()}><Text style={StyleSheet.pressableValueText}>+</Text></Pressable>
                </View>
                <Text style={StyleSheet.largeText}>Toistot</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                    <Pressable style={StyleSheet.minusButton} onPress={() => handleMinusRepsPress()}><Text style={StyleSheet.pressableValueText}>-</Text></Pressable>  
                    <TextInput style={StyleSheet.input}
                        value={reps.toString()}
                        onChangeText={text => setReps(parseInt(text) || 0)}
                        keyboardType='numeric'
                    />
                    <Pressable style={StyleSheet.plusButton} onPress={() => handlePlusRepsPress()}><Text style={StyleSheet.pressableValueText}>+</Text></Pressable>
                </View>
            {exerciseDetails.length !== 0 && exerciseDetails.map((ed, index) =>
                <View  key={index} style={StyleSheet.listElement}>
                    <Text>{ed.weights} kg</Text>
                    <Text>x {ed.reps}</Text>
                    {!updateMode && <View style={{ flexDirection: 'row'}}> 
                        <Pressable onPress={() => editSet(index)}>
                            <FontAwesomeIcon size={22} icon={ faPencil } />
                        </Pressable>
                        <Pressable onPress={() => deleteSet(index)}>
                            <FontAwesomeIcon size={22} icon={ faTrashCan } />
                        </Pressable>
                    </View>}
                </View>
            )}
            <Pressable style={StyleSheet.pressableButton} 
                onPress={() => addSet()} >
                {!updateMode && <Text style={StyleSheet.pressableText}>Lisää</Text>}
                {updateMode && <Text style={StyleSheet.pressableText}>Päivitä</Text>}
            </Pressable>
            <Text style={StyleSheet.largeText}>Kommentit</Text>
            <TextInput 
                value={comments}
                onChangeText={text => setComments(text)}/>
            </View>
        )
    }

    const cardioDetails = () => {
        return(
            <View>
                <Text>Matka (km)</Text>
            <TextInput style={StyleSheet.input}
                value={kms}
                onChangeText={text => setKms(text)}
                keyboardType='numeric'
                placeholder='km'/>
            <Text>Aika (min)</Text>
            <TextInput style={StyleSheet.input}
                value={time}
                onChangeText={text => setTime(text)}
                keyboardType='numeric'
                placeholder='minutes'/>
            <Text>Kommentit</Text>
            <TextInput
                value={comments}
                onChangeText={text => setComments(text)}/>
            </View>
        )
    }

    const stretchDetails = () => {
        return(
            <View>
            <Text>Aika (min)</Text>
            <TextInput style={StyleSheet.input}
                value={time}
                onChangeText={text => setTime(text)}
                keyboardType='numeric'
                placeholder='minutes'/>
            <Text>Kommentit</Text>
            <TextInput style={StyleSheet.input}
                value={comments}
                onChangeText={text => setComments(text)}/>
            </View>
        )
    }

    return(
        <ScrollView>
            <Text style={[StyleSheet.workoutHeader, StyleSheet.workoutHeaderText]}>{exercise}</Text>
            {classification === "Kuntosali" && gymDetails()}
            {classification === "Cardio" && cardioDetails()}
            {classification === "Muu" && cardioDetails()}
            {classification === "Kehonhuolto" && stretchDetails()}
            {!updateMode && <View>
                <Pressable style={StyleSheet.pressableButton} onPress={() => {
                    const details = {
                        kms: kms,
                        time: time,
                        gymExercise: exercise,
                        gymExerciseDetails: exerciseDetails
                    }
                    navigation.navigate("Home", {details, comments, classification})
                }}>
                    <Text style={StyleSheet.pressableText}>Tallenna</Text>
                </Pressable>
            </View>}
        </ScrollView>
    )
}