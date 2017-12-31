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

import { StackNavigator } from 'react-navigation'
import JournalScreen from '../screens/JournalScreen'

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const settings = []

export default class WorkoutScreen extends React.Component {
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
      modalVal: -1,
      selectModalVisible: false,
      workoutModalVisible: false,
      congratsModalVisible: false,
      day: 0,
      dailyWorkout: [],
      chosenWorkout: [],
      swimHows: [],
      bikeHows: [],
      runHows: [],
      activeSlide: 0,
      completed: false
    }
    this.load = this.load.bind(this)
    this.readDayChanges = this.readDayChanges.bind(this)
    this.select = this.select.bind(this)
    this.submit = this.submit.bind(this)
    this.openModal = this.openModal.bind(this)
    this.prepareWorkout = this.prepareWorkout.bind(this)
    this.getHowTos = this.getHowTos.bind(this)
    this.complete = this.complete.bind(this)
    this._renderItem = this._renderItem.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  componentDidMount() {
    this.load()
    this.readDayChanges()
  }

  load() {
    var user = firebase.auth().currentUser;
    var currDay;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      currDay = snapshot.val().day
      var workouts = snapshot.val().selectedWorkouts ? snapshot.val().selectedWorkouts : []
      var workout = workouts[currDay] ? workouts[currDay] : {}
      var swimLevel = workout.swimDifficulty ? workout.swimDifficulty : -1
      var bikeLevel = workout.bikeDifficulty ? workout.bikeDifficulty : -1
      var runLevel = workout.runDifficulty ? workout.runDifficulty : -1
      if (swimLevel === 'Beginner') {
        swimLevel = 0
      } else if (swimLevel === 'Intermediate') {
        swimLevel = 1
      } else if (swimLevel === 'Advanced') {
        swimLevel = 2
      }
      if (bikeLevel === 'Beginner') {
        bikeLevel = 0
      } else if (bikeLevel === 'Intermediate') {
        bikeLevel = 1
      } else if (bikeLevel === 'Advanced') {
        bikeLevel = 2
      }
      if (runLevel === 'Beginner') {
        runLevel = 0
      } else if (runLevel === 'Intermediate') {
        runLevel = 1
      } else if (runLevel === 'Advanced') {
        runLevel = 2
      }
      this.setState({
        day: snapshot.val().day,
        swimLevel: swimLevel,
        bikeLevel: bikeLevel,
        runLevel: runLevel
      })
    }).then(response => {
      database.ref('/workouts/' + currDay).once('value').then(snapshot => {
        var rest = false;
        if (!snapshot.val().swim && !snapshot.val().bike && !snapshot.val().run) {
          rest = true;
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
          modalVal: -1,
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

  readDayChanges() {
    var user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid + '/day/').on('value', (snapshot) => {
      this.load()
    });
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
    if (this.state.total !== chosen) {
      alert('Select an option for each workout!')
    } else {
      var choice = {
        completed: false,
        rest: false,
        day: this.state.day
      }

      if (this.state.swim) {
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
        level: 'RUN: ' + choice.runDifficulty,
        text: choice.runWorkout,
        info: choice.runInfo
      })
    }
    this.setState({
      completed: false,
      chosenWorkout: thisWorkout,
      workoutModalVisible: true
    })
  }

  getHowTos(l) {
    var list = []
    var user = firebase.auth().currentUser;
    var typeA
    var typeB
    if (l === 'S') {
      typeA = 'swim'
      typeB = 'swim/bike'
    } else if (l === 'B') {
      typeA = 'bike'
      typeB = 'bike/run'
    } else if (l === 'R') {
      typeA = 'run'
      typeB = 'none'
    }
    database.ref('/tutorials/').once('value').then(snapshot => {
      tuts = snapshot.val()
      var tutList = tuts[this.state.day] ? tuts[this.state.day] : []
      tutList.forEach(item => {
        if (item.type === typeA || item.type === typeB) {
          list.push(item)
        }
      })

      if (l === 'S') {
        this.setState({
          swimHows: list
        })
      } else if (l === 'B') {
        this.setState({
          bikeHows: list
        })
      } else if (l === 'R') {
        this.setState({
          runHows: list
        })
      }
    })
    .catch(error => {
      console.log('Error getting tutorials: ' + error.message)
    })
  }

  _onScroll(index){
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

    updates['/users/' + user.uid + '/selectedWorkouts/' + this.state.day + "/completed"] = true
    firebase.database().ref().update(updates)
    .catch(error => {
      console.log('Error Updating: ' + error.message)
    })
    this.setState({
      completed: true,
      day: this.state.day + 1
    })

    var updates = {}
    updates['/users/' + user.uid + '/day'] = this.state.day + 1
    firebase.database().ref().update(updates)
    .then(result => {
      this.load()
    })
    .catch(error => {
      console.log('Error Updating: ' + error.message)
    })

    this.setState({
      workoutModalVisible: false,
    })

    if (this.state.day % 7 === 0) {
      this.setState({
        congratsModalVisible: true
      })
    } else {
      const { navigate } = this.props.navigation
      navigate('Journal', { new: true })
    }
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
    return action;
  }

  _renderItem ({item, index}) {
    var l = item.level[0]
    this.getHowTos(l)
    var list
    if (l === 'S') {
      list = this.state.swimHows
    } else if (l === 'B') {
      list = this.state.bikeHows
    } else if (l === 'R') {
      list = this.state.runHows
    }
    if (index < settings.length) {
      return (
        <View style={styles.slideContainer}>
          <View key={index} style={styles.modalTextContainer}>
            <Text style={styles.modalTitle}>{item.level}</Text>
            <Text style={styles.modalInfo}>{'FOCUS: ' + item.info}</Text>
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
                  return (
                    action.map((action2, i2) => {
                      return <Text key={i2} style={style}>{action2}</Text>
                    })
                  )
                }
              })}
            </View>
            <Text style={styles.modalTitle}>Today's How To's:</Text>
            {list.map((item, i) => {
              return <View key={i}>
                <Text style={styles.toTextYellow}>{item.text}</Text>
                <Text style={styles.toText}>{item.description}</Text>
                {item.category === 'gear' ?
                <Text>MAP</Text> :
                null
                }
                {item.category === 'video' ?
                <Text>VIDEO</Text> :
                null
                }
                <Text></Text>
              </View>
            })}
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
                  style = styles.modalTextYellow
                }
                if (typeof(item) === 'string') {
                  return <Text key={i} style={style}>{item}</Text>
                } else {
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
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 6
  },
  modalTextYellow: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Colors.ourYellow,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 6
  },
  modalTitle: {
    fontFamily: 'kalam-bold',
    fontSize: 22,
    color: Colors.ourYellow,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  modalInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'justify',
    backgroundColor: 'transparent',
    paddingBottom: 15
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
    padding: 10,
    marginBottom: 10
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
  toText: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'justify',
    backgroundColor: 'transparent',
    paddingBottom: 4
  },
  toTextYellow: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Colors.ourYellow,
    textAlign: 'justify',
    backgroundColor: 'transparent',
    paddingBottom: 4
  },
  pagination: {
    marginTop: 10
  }
});
