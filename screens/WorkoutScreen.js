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

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'MyWorkout',
  };

  constructor(props) {
    super(props)
    this.state = {
      rest: false,
      swim: true,
      bike: true,
      run: true,
      dailyWorkout: {},
      chosenWorkout: {}
    }
  }

  findPath() {
    var user = firebase.auth().currentUser;

    var path = '';
    var pathArray = user.email.split('@')[0]
    pathArray.split('').forEach(letter => {
      if (letter != '.') {
        path = path + letter
      } else {
        path = path + '@'
      }
    })
    console.log('path: ' + path)
    return path
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    var path = this.findPath();
    // this.setState({rest: true})
  }

  selectLevel() {

  }

  submit() {

  }

  nextDay() {

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
            <Text style={styles.headerText}>MyWorkout</Text>
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
                      onPress={() => {this.selectLevel()}}
                      style={styles.levelBox}>
                      <Text style={styles.levelText}>BEGINNER</Text>
                      <Text style={styles.infoText}>Small desc.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {this.selectLevel()}}
                      style={styles.levelBox}>
                      <Text style={styles.levelText}>INTERMED.</Text>
                      <Text style={styles.infoText}>Small desc.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {this.selectLevel()}}
                      style={styles.levelBox}>
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
                      onPress={() => {this.selectLevel()}}
                      style={styles.levelBox}>
                      <Text style={styles.levelText}>BEGINNER</Text>
                      <Text style={styles.infoText}>Small desc.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {this.selectLevel()}}
                      style={styles.levelBox}>
                      <Text style={styles.levelText}>INTERMED.</Text>
                      <Text style={styles.infoText}>Small desc.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {this.selectLevel()}}
                      style={styles.levelBox}>
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
                      onPress={() => {this.selectLevel()}}
                      id="swim-easy"
                      style={styles.levelBox}>
                      <Text style={styles.levelText}>BEGINNER</Text>
                      <Text style={styles.infoText}>Small desc.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {this.selectLevel()}}
                      id="swim-med"
                      style={styles.levelBox}>
                      <Text style={styles.levelText}>INTERMED.</Text>
                      <Text style={styles.infoText}>Small desc.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {this.selectLevel()}}
                      id="swim-hard"
                      style={styles.levelBox}>
                      <Text style={styles.levelText}>ADVANCED</Text>
                      <Text style={styles.infoText}>Small desc.</Text>
                    </TouchableOpacity>
                  </View>
                </View> :
                <View></View>
              }
              <View style={styles.submit}>
                <TouchableOpacity
                  onPress={() => {this.submit()}}
                  style={styles.submitBox}>
                  <Text style={styles.submitText}>Get Working!</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </View>
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
    marginBottom: 10
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
    justifyContent: 'center'
  },
  levelBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.ourYellow,
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    padding: 7,
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
    fontSize: 15,
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
