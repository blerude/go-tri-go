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
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ExpoLinksView } from '@expo/samples';
import RadioGroup from 'react-native-custom-radio-group';
import Modal from 'react-native-modal'

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const settings = []

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'My Workout',
  };

  constructor(props) {
    super(props)
    this.state = {
      rest: false,
      swim: false,
      bike: false,
      run: false,
      total: 0,
      swimLevel: -1,
      bikeLevel: -1,
      runLevel: -1,
      selectModalVisible: false,
      modalVal: -1,
      workoutModalVisible: false,
      day: 0,
      dailyWorkout: [],
      chosenWorkout: [],
      activeSlide: 0,
      completed: false
    }
    this.load = this.load.bind(this)
    this.select = this.select.bind(this)
    this.submit = this.submit.bind(this)
    this.openModal = this.openModal.bind(this)
    this.prepareWorkout = this.prepareWorkout.bind(this)
    this.complete = this.complete.bind(this)
    this._renderItem = this._renderItem.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  componentDidMount() {
    this.load()
  }

  // componentDidUpdate() {
  //   this.load()
  // }

  load() {
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
          console.log('REST')
          var choice = {
            completed: false,
            rest: false
          }
          var updates = {}
          updates['/users/' + user.uid + '/selectedWorkouts/' + this.state.day] = choice
          firebase.database().ref().update(updates)
          .catch(error => {
            console.log('Error Updating: ' + error.message)
          })
          this.setState({
            chosenWorkout: []
          })
        }
        var total = 0;
        if (snapshot.val().swim) {
          total = total + 1;
        }
        if (snapshot.val().bike) {
          total = total + 1;
        }
        if (snapshot.val().run) {
          total = total + 1;
        }
        this.setState({
          rest: rest,
          swim: snapshot.val().swim,
          bike: snapshot.val().bike,
          run: snapshot.val().run,
          total: total,
          dailyWorkout: {
            swim: snapshot.val().swimWorkout,
            swimInfo: snapshot.val().swimInfo,
            bike: snapshot.val().bikeWorkout,
            bikeInfo: snapshot.val().bikeInfo,
            run: snapshot.val().runWorkout,
            runInfo: snapshot.val().runInfo
          }
        })
      });
    })
  }

  openModal(val) {
    this.setState({modalVal: val, selectModalVisible: true})
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
    this.setState({selectModalVisible: false})
  }

  submit() {
    var user = firebase.auth().currentUser;
    var chosen = 0;
    if (this.state.swimLevel > -1) {
      chosen = chosen + 1
    }
    if (this.state.bikeLevel > -1) {
      chosen = chosen + 1
    }
    if (this.state.runLevel > -1) {
      chosen = chosen + 1
    }
    console.log('TOTAL: ' + this.state.total + ' and CHOSEN: ' + chosen)
    if (this.state.total !== chosen) {
      alert('Select an option for each workout!')
    } else {
      console.log('SWIM: ' + this.state.swimLevel)
      console.log('BIKE: ' + this.state.bikeLevel)
      console.log('RUN: ' + this.state.runLevel)
      var choice = {
        completed: false,
        rest: false
      }

      if (this.state.swim) {
        console.log('swim: ', this.state.dailyWorkout.swim)
        choice['swimWorkout'] = this.state.dailyWorkout.swim[this.state.swimLevel]
        choice['swimInfo'] = this.state.dailyWorkout.swimInfo
        if (this.state.swimLevel === 0) {
          choice['swimDifficulty'] = 'Beginner'
        } else if (this.state.swimLevel === 1) {
          choice['swimDifficulty'] = 'Intermediate'
        } else if (this.state.swimLevel === 2) {
          choice['swimDifficulty'] = 'Advanced'
        }
      }
      if (this.state.bike) {
        console.log('bike: ', this.state.dailyWorkout.bike)
        choice['bikeWorkout'] = this.state.dailyWorkout.bike[this.state.bikeLevel]
        choice['bikeInfo'] = this.state.dailyWorkout.bikeInfo
        if (this.state.bikeLevel === 0) {
          choice['bikeDifficulty'] = 'Beginner'
        } else if (this.state.bikeLevel === 1) {
          choice['bikeDifficulty'] = 'Intermediate'
        } else if (this.state.bikeLevel === 2) {
          choice['bikeDifficulty'] = 'Advanced'
        }
      }
      if (this.state.run) {
        console.log('run: ', this.state.dailyWorkout.run)
        choice['runWorkout'] = this.state.dailyWorkout.run[this.state.runLevel]
        choice['runInfo'] = this.state.dailyWorkout.runInfo
        if (this.state.runLevel === 0) {
          choice['runDifficulty'] = 'Beginner'
        } else if (this.state.runLevel === 1) {
          choice['runDifficulty'] = 'Intermediate'
        } else if (this.state.runLevel === 2) {
          choice['runDifficulty'] = 'Advanced'
        }
      }
      console.log('choice: ', choice)
      var updates = {}
      updates['/users/' + user.uid + '/selectedWorkouts/' + this.state.day] = choice
      firebase.database().ref().update(updates)
      .catch(error => {
        console.log('Error Updating: ' + error.message)
      })
      this.prepareWorkout(choice)
    }
  }

  prepareWorkout(choice) {
    var thisWorkout = []
    settings = []
    if (choice.hasOwnProperty('swimDifficulty')) {
      thisWorkout.push('SWIM: ' + choice.swimDifficulty)
      thisWorkout.push(choice.swimWorkout)
      settings.push({
        screen: 'swim',
        level: 'SWIM: ' + choice.swimDifficulty,
        text: choice.swimWorkout,
        info: choice.swimInfo
      })
    }
    if (choice.hasOwnProperty('bikeDifficulty')) {
      thisWorkout.push('BIKE: ' + choice.bikeDifficulty)
      thisWorkout.push(choice.bikeWorkout)
      settings.push({
        screen: 'bike',
        level: 'BIKE: ' + choice.bikeDifficulty,
        text: choice.bikeWorkout,
        info: choice.bikeInfo
      })
    }
    if (choice.hasOwnProperty('runDifficulty')) {
      thisWorkout.push('RUN: ' + choice.runDifficulty)
      thisWorkout.push(choice.runWorkout)
      settings.push({
        screen: 'run',
        level: 'RUN: ' + runDifficulty,
        text: choice.runWorkout,
        info: choice.runInfo
      })
    }
    console.log('this: ', thisWorkout)
    this.setState({
      chosenWorkout: thisWorkout,
      workoutModalVisible: true
    })
    console.log('SETTINGS: ', settings)
    console.log('WORKOUT!', thisWorkout)
  }

  _onScroll(index){
    console.log('CURRENT INDEX: ', index)
    this.setState({activeSlide: index})
  }

  get pagination () {
     const activeSlide = this.state.activeSlide;
     return (
         <Pagination style={styles.pagination}
           dotsLength={settings.length}
           activeDotIndex={activeSlide}
         />
     );
   }

  complete() {
    var user = firebase.auth().currentUser;
    var updates = {}
    console.log('hi')
    updates['/users/' + user.uid + '/selectedWorkouts/' + this.state.day + "/completed"] = true
    firebase.database().ref().update(updates)
    .catch(error => {
      console.log('Error Updating: ' + error.message)
    })
    this.setState({
      completed: true,
      day: this.state.day + 1
    })
  }

  getWorkoutLevel(val) {
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

  getWorkout(val) {
    let action = ""
    if (val === 0) {
      action = this.state.dailyWorkout.swim[0]
    } else if (val === 1) {
      action = this.state.dailyWorkout.swim[1]
    } else if (val === 2) {
      action = this.state.dailyWorkout.swim[2]
    } else if (val === 3) {
      action = this.state.dailyWorkout.bike[0]
    } else if (val === 4) {
      action = this.state.dailyWorkout.bike[1]
    } else if (val === 5) {
      action = this.state.dailyWorkout.bike[2]
    } else if (val === 6) {
      action = this.state.dailyWorkout.run[0]
    } else if (val === 7) {
      action = this.state.dailyWorkout.run[1]
    } else if (val === 8) {
      action = this.state.dailyWorkout.run[2]
    } else {
      action = []
    }
    console.log('action: ', action)
    return action;
  }

  _renderItem ({item, index}) {
    console.log('INDEX: ' + index)
    if (index < settings.length) {
      console.log('ITEM:', item)
      return (
        <View style={styles.slideContainer}>
          <View key={index} style={styles.modalTextContainer}>
            <Text style={styles.modalTitle}>{item.level}</Text>
            <Text style={styles.modalInfo}>{item.info}</Text>
            <View style={styles.workoutContainer}>
              {item.text.map((action, i) => {
                var style;
                if (i % 2 === 0) {
                  style = styles.modalText
                } else {
                  style = styles.modalTextYellow
                }
                if (typeof(action) === 'string') {
                  return <Text key={i} style={style}>{action}</Text>
                } else {
                  console.log('next: ', action)
                  return (
                    action.map((action2, i2) => {
                      return <Text key={i2} style={style}>{action2}</Text>
                    })
                  )
                }
              })}
            </View>
          </View>
        </View>
      )
    }
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
                  onPress={this.complete}
                  style={this.state.completed ? styles.modalSubmitComplete : styles.modalSubmit}>
                  <Text style={styles.modalText}>Completed</Text>
                </TouchableOpacity>
              </View>
            </View> :
            <View style={styles.contentContainer}>
              <Text style={styles.contentHeader}>Select your workout for day {this.state.day}:</Text>
              {
                this.state.swim ?
                <View style={styles.workoutGroup} id="swim">
                  <Text style={styles.workoutHeader}>Swim:</Text>
                  <View style={styles.levelSelectionBox}>
                     <TouchableOpacity
                       onPress={() => this.openModal(0)}
                       style={this.state.swimLevel === 0 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>BEGINNER</Text>
                       {/* <Text style={styles.infoText}>Small desc.</Text> */}
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(1)}
                       style={this.state.swimLevel === 1 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>INTERMED.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(2)}
                       style={this.state.swimLevel === 2 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>ADVANCED</Text>
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
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(4)}
                       style={this.state.bikeLevel === 1 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>INTERMED.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(5)}
                       style={this.state.bikeLevel === 2 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>ADVANCED</Text>
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
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(7)}
                       style={this.state.runLevel === 1 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>INTERMED.</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                       onPress={() => this.openModal(8)}
                       style={this.state.runLevel === 2 ? styles.levelBoxActive : styles.levelBox}>
                       <Text style={styles.levelText}>ADVANCED</Text>
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
          isVisible={this.state.selectModalVisible}
          style={styles.modalContainer}>
          <View style={styles.modalExitContainer}>
            <TouchableOpacity
              onPress={() => this.setState({selectModalVisible: false})}
              style={styles.modalExit}>
                <Text style={styles.modalText}>x</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalHeader}>What You'll Do:</Text>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalTitle}>{this.getWorkoutLevel(this.state.modalVal)}</Text>
            <View style={styles.workoutContainer}>
              {this.getWorkout(this.state.modalVal).map((item, i) => {
                var style;
                if (i % 2 === 0) {
                  style = styles.modalText
                } else {
                  style = styles.modalTextBlack
                }
                if (typeof(item) === 'string') {
                  return <Text key={i} style={style}>{item}</Text>
                } else {
                  console.log('next: ', item)
                  return (
                    item.map((item2, i2) => {
                      return <Text key={i2} style={style}>{item2}</Text>
                    })
                  )
                }
              })}
            </View>
          </View>
          <TouchableOpacity
            onPress={this.select}
            style={styles.modalSubmit}>
            <Text style={styles.modalText}>Select</Text>
          </TouchableOpacity>
        </Modal>

        <Modal
          isVisible={this.state.workoutModalVisible}
          style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalExitContainer}>
              <TouchableOpacity
                onPress={() => this.setState({workoutModalVisible: false})}
                style={styles.modalExit}>
                  <Text style={styles.modalText}>x</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHeader}>What To Do:</Text>
            <View style={styles.carouselContainer}>
              <Carousel
                renderItem={this._renderItem}
                data={settings}
                sliderWidth={320}
                sliderHeight={320}
                itemWidth={215}
                inactiveSlideOpacity={0.1}
                loop={false}
                activeSlideAlignment={'center'}
                onSnapToItem={this._onScroll}
              />
              { this.pagination }
            </View>
            <TouchableOpacity
              onPress={this.complete}
              style={this.state.completed ? styles.modalSubmitComplete : styles.modalSubmit}>
              <Text style={styles.modalText}>Completed Workout</Text>
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
    paddingBottom: 8
  },
  modalText: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalTextYellow: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    color: Colors.ourYellow,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalTextBlack: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalTitle: {
    fontFamily: 'kalam-bold',
    fontSize: 22,
    color: Colors.ourYellow,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalInfo: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    color: 'black',
    textAlign: 'justify',
    backgroundColor: 'transparent',
    paddingBottom: 8
  },
  modalSubmit: {
    marginTop: 'auto',
    borderColor: Colors.ourYellow,
    backgroundColor: Colors.ourYellow,
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
  workoutContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.ourYellow,
    padding: 10
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
    'padding': 4,
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
    'padding': 2,
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
  carouselContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  slideContainer: {
    marginTop: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 215,
  },
  pagination: {
    marginTop: 10
  }
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
