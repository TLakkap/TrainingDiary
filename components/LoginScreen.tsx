import { StatusBar } from 'expo-status-bar';
import { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define Stack-parameters
type RootStackParamList = {
  Home: undefined;
};

// Define types for props
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function LoginScreen({ navigation }: HomeScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View>
      <Text>Sähköposti</Text>
      <TextInput 
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType='email-address'
        placeholder='email'
      />
      <Text>Salasana</Text>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder='salasana'
      />
      <Button
        title="Kirjaudu"
        onPress={() => navigation.navigate('Home')}
        />
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}