import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

interface SearchProps {
    executeSearch: (search: string) => void
  }

export default function Search({ executeSearch }: SearchProps) {
    const [search, setSearch] = useState('')

    return (
        <View style={styles.searchBox}>
            <TextInput style={{ fontSize: 20 }}
            value={search}
            onChangeText={text => setSearch(text)}
            placeholder='Search...'
            returnKeyType='search'
            onSubmitEditing={() => executeSearch(search)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBox: {
        marginBottom: 10,
        borderColor: '#333',
        borderWidth: 1,
        padding: 5,       
    }
})