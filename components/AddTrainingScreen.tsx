import { useState, useEffect } from 'react';
import { FlatList, Text, View, Button } from 'react-native';
import { EXERCISEDATA } from '../Data';

interface Exercise {
    id: string
    exercise: string
}

export default function AddTrainingScreen() {

    const renderItem = ({ item }: { item: Exercise}) => {
        return (<Text>{item.exercise}</Text>)
    }

    return(
        <FlatList
            data={EXERCISEDATA}
            renderItem={renderItem}
        ></FlatList>
    )

}