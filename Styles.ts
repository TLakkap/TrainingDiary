import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        height: '100%'
      },
      calendar: {
        backgroundColor: '#d8f3dc',
        borderWidth: 1
      },
      mediumColor: {
        backgroundColor: '#bbdefb',
      },
      login: {
        padding: 30,
      },
      day: {
        fontWeight: 'bold',
        padding: 2,
        fontSize: 18,
        borderWidth: 2,
        borderColor: '#22577a',
        textAlign: 'center', 
        backgroundColor: '#38a3a5'
      },
      workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#57cc99',
      },
      workoutHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5
      },
      listElement: {
        width: '97%',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        margin: 5,
        justifyContent: 'space-between',
        backgroundColor: '#d8f3dc'
      },
      row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 5
      },
      buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      addNew: {
        padding: 10,
        margin: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#97b498'
      },
      text: {
        fontSize: 16,
      },
      helpText: {
        fontSize: 8,
        fontWeight: 'bold'
      },
      center: {
        alignItems: 'center',
        justifyContent: 'center'
      },
      input: {
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 12,
        padding: 4
      },
      icon: {
        padding: 5
      },
})