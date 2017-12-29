import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';import { ExpoLinksView } from '@expo/samples';
import Modal from 'react-native-modal'

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Journal',
    color: 'white'
  };

  constructor(props) {
    super(props)
    this.state = {
      day: 0,
      thisDay: '',
      journals: {},
      trainingText: '',
      nutritionText: '',
      raceText: '',
      write: false
    }
    this.newEntry = this.newEntry.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      this.setState({
        day: snapshot.val().day,
        journals: snapshot.val().journals
      })
    })
  }

  newEntry() {
    this.setState({
      write: true
    })
  }

  save() {
    var user = firebase.auth().currentUser;
    var entry = [
      this.state.trainingText,
      this.state.nutritionText,
      this.state.raceText
    ]
    console.log('ENTRY: ', entry)
    var updates = {}
    updates['/users/' + user.uid + '/journals/' + this.state.thisDay] = entry
    firebase.database().ref().update(updates)
    .catch(error => {
      console.log('Error Updating: ' + error.message)
    })

    this.state.journals[this.state.thisDay] = entry
    console.log('JOURNALS: ', this.state.journals)

    this.setState({
      write: false,
      trainingText: '',
      nutritionText: '',
      raceText: '',
      journals: this.state.journals
    })
  }

  render() {
    return (
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.strip} >
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={require('../tri.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Journal</Text>
          </View>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              onPress={() => this.setState({write: true})}
              style={styles.modalSubmit}>
              <Text style={styles.buttonText}>Add an Entry</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          isVisible={this.state.write}
          style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalExitContainer}>
              <TouchableOpacity
                onPress={() => this.setState({write: false})}
                style={styles.modalExit}>
                  <Text style={styles.modalText}>x</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHeader}>Write about your workout:</Text>
            <View style={styles.modalTextContainer}>
              {/* <Text style={styles.modalTitle}>{"Day " + this.state.day}</Text> */}
              <View style={styles.entryContainer}>
                <Text style={styles.modalEntryLabel}>Day:</Text>
                <View style={styles.center}>
                  <TextInput
                      onChangeText={(thisDay) => this.setState({thisDay})}
                      value={this.state.thisDay}
                      style={styles.textInputDay}
                      required/>
                </View>
                <Text style={styles.modalEntryLabel}>Training:</Text>
                <Text style={styles.modalInfo}>What went well, what didn't, challenge level</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(trainingText) => this.setState({trainingText})}
                    value={this.state.trainingText}
                    style={styles.textInput}/>
                <Text style={styles.modalEntryLabel}>Nutrition:</Text>
                <Text style={styles.modalInfo}>What you ate, what you drank</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={8}
                    onChangeText={(nutritionText) => this.setState({nutritionText})}
                    value={this.state.nutritionText}
                    style={styles.textInput}/>
                <Text style={styles.modalEntryLabel}>Race Day:</Text>
                <Text style={styles.modalInfo}>What to think about before your race</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={12}
                    onChangeText={(raceText) => this.setState({raceText})}
                    value={this.state.raceText}
                    style={styles.textInput}/>
              </View>
            </View>
            <TouchableOpacity
              onPress={this.save}
              style={styles.modalSubmit}>
              <Text style={styles.modalText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>

        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: Colors.ourGrey
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ourGrey,
    paddingTop: 10,
    alignItems: 'center'
  },
  logo: {
    width: 70,
    height: 26,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 5,
  },
  logoContainer: {
    width: screenWidth,
    marginLeft: 20,
  },
  strip: {
    flex: 1,
    height: 58,
    width: 500,
    backgroundColor: Colors.ourBlue,
    position: 'absolute',
    zIndex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
    borderWidth: 1,
    borderTopColor: 'white',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [
      {rotate: '-10deg'}
    ]
  },
  headerContainer: {
    marginTop: 4
  },
  headerText: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  contentContainer: {
    marginTop: 30,
    padding: 15,
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: Colors.ourBlue
  },
  buttonText: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 6
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.ourGrey,
    borderColor: Colors.ourBlue,
    borderWidth: 5,
    borderRadius: 5,
  },
  modalExitContainer: {
    marginTop: 3,
    display: 'flex',
    alignItems: 'flex-end'
  },
  modalExit: {
    display: 'flex',
    justifyContent: 'center',
    borderColor: Colors.ourBlue,
    backgroundColor: Colors.ourBlue,
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
    width: 30,
    height: 30,
  },
  modalHeader: {
    fontFamily: 'kalam-bold',
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalTextContainer: {
    paddingBottom: 8
  },
  modalText: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 6
  },
  modalTextBlue: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 6
  },
  modalTitle: {
    fontFamily: 'kalam-bold',
    fontSize: 22,
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalEntryLabel: {
    fontFamily: 'kalam-bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalInfo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 5
  },
  modalSubmit: {
    marginTop: 'auto',
    borderColor: Colors.ourBlue,
    backgroundColor: Colors.ourBlue,
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
  },
  modalSubmitComplete: {
    marginTop: 'auto',
    borderColor: Colors.ourGreen,
    backgroundColor: Colors.ourGreen,
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
  },
  entryContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.ourBlue,
    padding: 10,
    marginBottom: 10
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.ourBlue,
    backgroundColor: 'white',
    color: Colors.ourBlue,
    fontSize: 15,
    paddingBottom: 15,
    marginBottom: 15
  },
  textInputDay: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.ourBlue,
    backgroundColor: 'white',
    color: Colors.ourBlue,
    fontSize: 15,
    width: 50,
    textAlign: 'center',
    paddingBottom: 15,
    marginBottom: 15
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
