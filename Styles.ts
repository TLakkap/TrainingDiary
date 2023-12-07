import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#eef4ed'
      },
      calendar: {
        backgroundColor: '#ffffff',
        borderWidth: 1
      },
      login: {
        padding: 30,
      },
      day: {
        fontWeight: 'bold',
        padding: 2,
        fontSize: 18,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center', 
      },
      workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#89c2d9',
        borderBottomWidth: 1,
        marginBottom: 2,
        marginTop: 2
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
        backgroundColor: '#ffffff'
      },
      flatlistElement: {
        fontSize: 24,
        borderBottomWidth: 1,
        borderRadius: 5,
        padding: 5,
        margin: 5,
        backgroundColor: '#ffffff',
      },
      comments: {
        width: '97%',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        margin: 5,
        backgroundColor: '#ffffff'
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
      pressableButton: {
        backgroundColor: '#38a3a5',
        width: '40%',
        fontWeight: 'bold',
        borderRadius: 25,
        margin: 5
      },
      pressableText: {
        fontSize: 30,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center'
      },
})