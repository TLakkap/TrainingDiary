import { useState } from 'react';
import { FlatList, Text, View, Button, Pressable } from 'react-native';
import { EXERCISEDATA } from '../Data';

interface Exercise {
    id: string
    exercise: string
}

export default function AddTrainingScreen() {
    const [selectedId, setSelectedId] = useState('')

    const renderItem = ({ item }: { item: Exercise}) => {
        return (
            <Pressable onPress={() => select(item.id)}>
                <Text style={{backgroundColor: item.id === selectedId ? '#c0c0c0': '#f5f5f5'}}>{item.exercise}</Text>
            </Pressable>
        )
    }

    const select = (id: string) => {
        setSelectedId(id)
    }

    return(
        <FlatList
            data={EXERCISEDATA}
            renderItem={renderItem}
        ></FlatList>
    )

}