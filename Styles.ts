import { StyleSheet } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
      },
      calendar: {
        borderTopWidth: 1
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
        backgroundColor: '#d6eadf',
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
        borderBottomWidth: 1,
        borderTopWidth: 1,
        padding: 6,
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
      largeText: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5
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
        width: '25%',
        fontSize: 18,
        borderRadius: 5,
        paddingTop: 5,
        paddingBottom: 5,
        //paddingLeft: 20,
        //paddingRight: 20,
        borderWidth: 1,
        backgroundColor: 'lightgray',
        borderColor: 'gray',
        textAlign: 'center'
      },
      pressableButton: {
        backgroundColor: '#d6eadf',
        borderColor: '#008000',
        fontWeight: 'bold',
        borderWidth: 5,
        borderRadius: 25,
        margin: 5,
        padding: 5
      },
      pressableText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      minusButton: {
        width: '15%',
        backgroundColor: '#ef233c',
        borderRadius: 10,
        margin: 10,
        borderWidth: 1
      },
      plusButton: {
        width: '15%',
        backgroundColor: '#40916c',
        borderRadius: 10,
        margin: 10,
        borderWidth: 1
      },
      pressableValueText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        padding: 5
      },
      commentsInput: {
        marginLeft: 5,
        marginRight: 5,
      },
      chartContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
      },
      chart: {
        marginVertical: 20,
        borderRadius: 16,
      },
})