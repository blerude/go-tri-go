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
    this.findEntries = this.findEntries.bind(this)
    this.delete = this.delete.bind(this)
    this.newEntry = this.newEntry.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      this.setState({
        day: snapshot.val().day,
        journals: snapshot.val().journals ? snapshot.val().journals : {}
      })
    })
  }

  findEntries(x) {
    var entries = []
    console.log('FOUND JOURNALS: ', this.state.journals)
    for (var key in this.state.journals) {
      if (key) {
        console.log('KEY: ' + key)
        console.log('FOUND ENTRY: ' + this.state.journals[key][x])
        if (this.state.journals[key][x]) {
          entries.push({
            day: key,
            entry: this.state.journals[key][x]
          })
        }
      }
    }
    console.log('E: ', entries)
    return entries
  }

  delete(x) {
    // console.log('DELETE!')
    // var user = firebase.auth().currentUser;
    // var updates = {}
    // updates['/users/' + user.uid + '/journals/' + DAY + '/' + x + '/'] = ''
    // firebase.database().ref().update(updates)
    // .catch(error => {
    //   console.log('Error Updating: ' + error.message)
    // })
  }

  newEntry() {
    this.setState({
      write: true
    })
  }

  save() {
    var user = firebase.auth().currentUser;
    var train;
    var nutr;
    var race;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      if (!this.state.trainingText &&
        snapshot.val().journals &&
        snapshot.val().journals[this.state.thisDay] &&
        snapshot.val().journals[this.state.thisDay][0]) {
        console.log('T1')
        train = snapshot.val().journals[this.state.thisDay][0]
      } else {
        console.log('T2')
        train = this.state.trainingText
      }

      if (!this.state.nutritionText &&
        snapshot.val().journals &&
        snapshot.val().journals[this.state.thisDay] &&
        snapshot.val().journals[this.state.thisDay][1]) {
        console.log('N1')
        nutr = snapshot.val().journals[this.state.thisDay][1]
      } else {
        console.log('N2')
        nutr = this.state.nutritionText
      }

      if (!this.state.raceText &&
        snapshot.val().journals &&
        snapshot.val().journals[this.state.thisDay] &&
        snapshot.val().journals[this.state.thisDay][2]) {
        console.log('R1')
        race = snapshot.val().journals[this.state.thisDay][2]
      } else {
        console.log('R2')
        race = this.state.raceText
      }

      var entry = [
        train,
        nutr,
        race
      ]
      console.log('NEW ENTRY: ', entry)
      var updates = {}
      updates['/users/' + user.uid + '/journals/' + this.state.thisDay] = entry
      firebase.database().ref().update(updates)
      .catch(error => {
        console.log('Error Updating: ' + error.message)
      })

      this.state.journals[this.state.thisDay] = entry
      console.log('UPDATED JOURNALS: ', this.state.journals)

      this.setState({
        write: false,
        trainingText: '',
        nutritionText: '',
        raceText: '',
        journals: this.state.journals
      })
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
            <Text style={styles.prompt}>Take notes on how your workout went!</Text>
            <TouchableOpacity
              onPress={() => this.setState({write: true})}
              style={styles.modalSubmit}>
              <Text style={styles.buttonText}>Add an Entry</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Journal Log:</Text>
            <Text style={styles.label}>Training:</Text>
            <View style={styles.entryContainer}>
              {this.findEntries(0).map((entry, i) => {
                return (
                  <View key={i} style={styles.entryPair}>
                    {/* <TouchableOpacity
                      onPress={() => this.delete(0)}
                      style={styles.removeEntry}>
                      <Text style={styles.removeText}>x</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.entryDay}>{'Day ' + entry.day}</Text>
                    <Text style={styles.entryEntry}>{entry.entry}</Text>
                    <View style={styles.line}></View>
                  </View>
                )
              })}
            </View>
            <Text style={styles.label}>Nutrition:</Text>
            <View style={styles.entryContainer}>
              {this.findEntries(1).map((entry, i) => {
                return (
                  <View key={i} style={styles.entryPair}>
                    {/* <TouchableOpacity
                      onPress={() => this.delete(1)}
                      style={styles.removeEntry}>
                      <Text style={styles.removeText}>x</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.entryDay}>{'Day ' + entry.day}</Text>
                    <Text style={styles.entryEntry}>{entry.entry}</Text>
                    <View style={styles.line}></View>
                  </View>
                )
              })}
            </View>
            <Text style={styles.label}>Race Day:</Text>
            <View style={styles.entryContainer}>
              {this.findEntries(2).map((entry, i) => {
                return (
                  <View key={i} style={styles.entryPair}>
                    {/* <TouchableOpacity
                      onPress={() => this.delete(2)}
                      style={styles.removeEntry}>
                      <Text style={styles.removeText}>x</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.entryDay}>{'Day ' + entry.day}</Text>
                    <Text style={styles.entryEntry}>{entry.entry}</Text>
                    <View style={styles.line}></View>
                  </View>
                )
              })}
            </View>
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
  prompt: {
    fontFamily: 'kalam-bold',
    fontSize: 19,
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  buttonText: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: 'kalam-bold',
    fontSize: 24,
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  label: {
    fontFamily: 'kalam-bold',
    fontSize: 21,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  entryPair: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5
  },
  removeEntry: {

  },
  removeText: {
    width: 20,
    paddingRight: 10,
    fontSize: 14,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  entryDay: {
    width: 60,
    paddingRight: 10,
    fontSize: 14,
    fontWeight: '900',
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  entryEntry: {
    width: 130,
    fontSize: 14,
    fontWeight: 'bold',
    width: 250,
    color: 'white',
    textAlign: 'justify',
    backgroundColor: 'transparent',
    // borderWidth: 1,
    // borderColor: 'white'
  },
  line: {
    borderBottomColor: Colors.ourBlue,
    borderBottomWidth: 1
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
    marginBottom: 15
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
