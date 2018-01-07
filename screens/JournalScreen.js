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
} from 'react-native';
import Modal from 'react-native-modal'

import firebase from '../firebase';
var database = firebase.database();

import Colors from '../constants/Colors';

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
      write: false,
      quotes: [],
      quote: ''
    }

    this.readDayChanges = this.readDayChanges.bind(this)
    this.findEntries = this.findEntries.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      var week = Math.ceil(snapshot.val().day / 7)
      this.setState({
        day: snapshot.val().day,
        journals: snapshot.val().journals ? snapshot.val().journals : {}
      })
    })
    database.ref('/quotes/').once('value').then(snapshot => {
      var week = Math.floor(this.state.day / 7)
      this.setState({
        quotes: snapshot.val(),
        quote: snapshot.val()[week]
      })
    })
    this.readDayChanges()
  }

  readDayChanges() {
    var user = firebase.auth().currentUser;
    database.ref('users/' + user.uid + '/day/').on('value', (snapshot) => {
      var week = Math.floor(snapshot.val() / 7)
      this.setState({
        day: snapshot.val(),
        quote: this.state.quotes[week]
      })
    });
  }

  findEntries(x) {
    var entries = []
    for (var key in this.state.journals) {
      if (key) {
        if (this.state.journals[key][x]) {
          entries.push({
            day: key,
            entry: this.state.journals[key][x]
          })
        }
      }
    }
    return entries
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
        train = snapshot.val().journals[this.state.thisDay][0]
      } else {
        train = this.state.trainingText
      }

      if (!this.state.nutritionText &&
        snapshot.val().journals &&
        snapshot.val().journals[this.state.thisDay] &&
        snapshot.val().journals[this.state.thisDay][1]) {
        nutr = snapshot.val().journals[this.state.thisDay][1]
      } else {
        nutr = this.state.nutritionText
      }

      if (!this.state.raceText &&
        snapshot.val().journals &&
        snapshot.val().journals[this.state.thisDay] &&
        snapshot.val().journals[this.state.thisDay][2]) {
        race = snapshot.val().journals[this.state.thisDay][2]
      } else {
        race = this.state.raceText
      }

      var entry = [
        train,
        nutr,
        race
      ]
      var updates = {}
      updates['/users/' + user.uid + '/journals/' + this.state.thisDay] = entry
      updates['/users/' + user.uid + '/selectedWorkouts/' + this.state.thisDay + '/journal/'] = entry
      firebase.database().ref().update(updates)
      .catch(error => {
        console.log('Error Updating: ' + error.message)
      })

      this.state.journals[this.state.thisDay] = entry

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
            <Text style={styles.label}>This week's affirmation:</Text>
            <Text style={styles.entryEntry}>{this.state.quote}</Text>
            <Text></Text>
            <Text style={styles.title}>Journal Log:</Text>
            <Text style={styles.label}>Training:</Text>
            <View style={styles.entryContainer}>
              {this.findEntries(0).map((entry, i) => {
                return (
                  <View key={i} style={styles.entryPair}>
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
