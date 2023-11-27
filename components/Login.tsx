import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Sähköposti</Text>
      <TextInput />
      <Text>Salasana</Text>
      <TextInput />
      <Button
        title="Kirjaudu"
        onPress={() => console.log("Kirjaudu-button pressed")}
        />
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}