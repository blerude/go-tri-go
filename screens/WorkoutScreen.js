import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import RadioGroup from 'react-native-custom-radio-group';
import Modal from 'react-native-modal'

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'My Workout',
  };

  constructor(props) {
    super(props)
    this.state = {
      rest: false,
      swim: true,
      bike: true,
      run: true,
      swimLevel: -1,
      bikeLevel: -1,
      runLevel: -1,
      modalVisible: false,
      modalVal: -1,
      day: 0,
      dailyWorkout: {},
      chosenWorkout: {}
    }
    this.select = this.select.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    var currDay;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      console.log('USER: ', snapshot.val())
      currDay = snapshot.val().day
      this.setState({day: snapshot.val().day})
    }).then(response => {
      console.log('CURR DAY: ' + currDay)
      database.ref('/workouts/' + currDay).once('value').then(snapshot => {
        console.log('DAY: ', snapshot.val())
        var rest = false;
        if (!snapshot.val().swim && !snapshot.val().bike && !snapshot.val().run) {
          rest = true;
        }
        this.setState({
          rest: rest,
          swim: snapshot.val().swim,
          bike: snapshot.val().bike,
          run: snapshot.val().run
        })
      });
    })
  }

  openModal(val) {
    this.setState({modalVal: val, modalVisible: true})
  }

  select() {
    if (this.state.modalVal < 0) {
      console.log('ERROR')
    } else if (this.state.modalVal < 3) {
      this.setState({swimLevel: this.state.modalVal})
    } else if (this.state.modalVal > 5) {
      this.setState({runLevel: this.state.modalVal - 6})
    } else {
      this.setState({bikeLevel: this.state.modalVal - 3})
    }
    this.setState({modalVisible: false})
  }

  submit() {
    if (this.state.swim && this.state.swimLevel < 0 ||
    this.state.bike && this.state.bikeLevel < 0 ||
    this.state.bike && this.state.runLevel < 0) {
      alert('Select an option for each workout!')
    } else {
      console.log('SWIM: ' + this.state.swimLevel)
      console.log('BIKE: ' + this.state.bikeLevel)
      console.log('RUN: ' + this.state.runLevel)
      this.setState

    }
  }

  nextDay() {

  }

  workout(val) {
    let title = ""
    if (val === 0) {
      title = 'SWIM: Beginner'
    } else if (val === 1) {
      title = 'SWIM: Intermediate'
    } else if (val === 2) {
      title = 'SWIM: Advanced'
    } else if (val === 3) {
      title = 'BIKE: Beginner'
    } else if (val === 4) {
      title = 'BIKE: Intermediate'
    } else if (val === 5) {
      title = 'BIKE: Advanced'
    } else if (val === 6) {
      title = 'RUN: Beginner'
    } else if (val === 7) {
      title = 'RUN: Intermediate'
    } else if (val === 8) {
      title = 'RUN: Advanced'
    }
    return title;
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
            <Text style={styles.headerText}>My Workout</Text>
          </View>
          {
            this.state.rest ?
            <View style={styles.contentContainer}>
              <Text style={styles.contentHeader}>You're doing great! Rest up today!</Text>
              <View style={styles.submit}>
                <TouchableOpacity
                  onPress={() => {this.nextDay()}}
                  style={styles.submitBox}>
                  <Text style={styles.submitText}>Completed</Text>
                </TouchableOpacity>
              </View>
            </View> :
            <View style={styles.contentContainer}>
              <Text style={styles.contentHeader}>Select your workout for the day:</Text>
              {
                this.state.swim ?
                <View style={styles.workoutGroup} id="swim">
                  <Text style={styles.workoutHeader}>Swim:</Text>
                  <View style={styles.levelSelectionBox}>
                     <TouchableOpacity
                       onPress={() => this.openModal(0)}
                       style={this.state.swimLevel === 0 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>BEGINNER</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(1)}
                       style={this.state.swimLevel === 1 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>INTERMED.</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(2)}
                       style={this.state.swimLevel === 2 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>ADVANCED</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                   </View>
                </View> :
                <View></View>
              }
              {
                this.state.bike ?
                <View style={styles.workoutGroup} id="bike">
                  <Text style={styles.workoutHeader}>Bike:</Text>
                  <View style={styles.levelSelectionBox}>
                     <TouchableOpacity
                       onPress={() => this.openModal(3)}
                       style={this.state.bikeLevel === 0 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>BEGINNER</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(4)}
                       style={this.state.bikeLevel === 1 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>INTERMED.</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(5)}
                       style={this.state.bikeLevel === 2 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>ADVANCED</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                   </View>
                </View> :
                <View></View>
              }
              {
                this.state.run ?
                <View style={styles.workoutGroup} id="run">
                  <Text style={styles.workoutHeader}>Run:</Text>
                  <View style={styles.levelSelectionBox}>
                     <TouchableOpacity
                       onPress={() => this.openModal(6)}
                       style={this.state.runLevel === 0 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>BEGINNER</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(7)}
                       style={this.state.runLevel === 1 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>INTERMED.</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(8)}
                       style={this.state.runLevel === 2 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>ADVANCED</Text>
                       <Text style={styles.infoText}>Small desc.</Text>
                     </TouchableOpacity>
                   </View>
                </View> :
                <View></View>
              }
              <View style={styles.submit}>
                <TouchableOpacity
                  onPress={this.submit}
                  style={styles.submitBox}>
                  <Text style={styles.submitText}>Get Working!</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </View>

        <Modal
          isVisible={this.state.modalVisible}
          style={styles.modalContainer}>
          <View style={styles.modalExitContainer}>
            <TouchableOpacity
              onPress={() => this.setState({modalVisible: false})}
              style={styles.modalExit}>
                <Text style={styles.modalText}>x</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalHeader}>What You'll Do:</Text>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalTitle}>{this.workout(this.state.modalVal)}</Text>
            <Text style={styles.modalText}></Text>
          </View>
          <TouchableOpacity
            onPress={this.select}
            style={styles.modalSubmit}>
            <Text style={styles.modalText}>Select</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 10
  },
  logo: {
    width: 70,
    height: 26,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 8,
  },
  logoContainer: {
    width: screenWidth,
    marginLeft: 20,
  },
  headerContainer: {
    marginTop: 3,
  },
  headerText: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  strip: {
    flex: 1,
    height: 58,
    width: 500,
    backgroundColor: Colors.ourYellow,
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
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.ourGrey,
    borderColor: Colors.ourYellow,
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
    borderColor: Colors.ourYellow,
    backgroundColor: Colors.ourYellow,
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
    width: 30,
    height: 30,
  },
  modalHeader: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalTextContainer: {

  },
  modalText: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalTitle: {
    fontFamily: 'kalam-bold',
    fontSize: 20,
    color: Colors.ourYellow,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalSubmit: {
    marginTop: 'auto',
    borderColor: Colors.ourYellow,
    backgroundColor: Colors.ourYellow,
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 38,
  },
  contentHeader: {
    fontFamily: 'kalam-bold',
    fontSize: 25,
    color: Colors.ourYellow,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  workoutGroup: {
    display: 'flex',
    marginBottom: 10,
    height: 100
  },
  workoutHeader: {
    fontFamily: 'kalam-bold',
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  levelSelectionBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBox: {
    'flex': 1,
    'alignItems': 'center',
    'justifyContent': 'center',
    'backgroundColor': Colors.ourGrey,
    'borderColor': Colors.ourYellow,
    'borderWidth': 1,
    'borderRadius': 5,
    'height': 50,
    'marginLeft': 10,
    'marginRight': 10,
    'padding': 7,
  },
  levelBoxActive: {
    'flex': 1,
    'alignItems': 'center',
    'justifyContent': 'center',
    'backgroundColor': Colors.ourGrey,
    'borderColor': Colors.ourYellow,
    'borderWidth': 5,
    'borderRadius': 5,
    'height': 50,
    'marginLeft': 10,
    'marginRight': 10,
    'padding': 7,
  },
  levelText: {
    fontFamily: 'kalam-bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },

  infoText: {
    fontFamily: 'kalam-bold',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  submit: {
    display: 'flex',
    alignItems: 'center',
    margin: 10
  },
  submitBox: {
    borderColor: Colors.ourYellow,
    backgroundColor: Colors.ourYellow,
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    width: 150,
    padding: 7,
  },
  submitText: {
    fontFamily: 'kalam-bold',
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
});

// const levelContainer = {
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'center',
//   height: 100
// }
//
// const levelBox = {
//   'flex': 1,
//   'alignItems': 'center',
//   'justifyContent': 'center',
//   'backgroundColor': Colors.ourGrey,
//   'borderColor': Colors.ourYellow,
//   'borderWidth': 1,
//   'borderRadius': 5,
//   'height': 50,
//   'marginLeft': 10,
//   'marginRight': 10,
//   'padding': 7,
// }
//
// const levelText = {
//   fontFamily: 'kalam-bold',
//   fontSize: 16,
//   color: 'white',
//   textAlign: 'center',
//   backgroundColor: 'transparent'
// }
//
// const levelBoxInactive = {
//   backgroundColor: Colors.ourGrey,
// }
//
// const levelBoxActive = {
//   backgroundColor: Colors.ourGrey,
//   // borderWidth: 5
// }
//
// const levelTextInactive = {
//   color: 'white',
// }
//
// <RadioGroup
//   radioGroupList={radioGroupData}
//   onChange={(value) => this.runModal(value)}
//   buttonContainerStyle={levelBox}
//   buttonTextStyle={levelText}
//   buttonContainerInactiveStyle={levelBoxInactive}
//   buttonContainerActiveStyle={levelBoxActive}
//   buttonTextInactiveStyle={levelTextInactive}
// />
