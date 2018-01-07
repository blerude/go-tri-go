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
import Modal from 'react-native-modal';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import firebase from '../firebase';
var database = firebase.database();

import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const settings = [];


export default class WorkoutScreen extends React.Component {
  static navigationOptions = {
    title: 'My Workout',
  }

  constructor(props) {
    super(props)
    this.state = {
      rest: false,                    // indicates if the workout is a rest day
      swim: false,                    // indicates if the workout has a swim
      bike: false,                    // indicates if the workout has a bike
      run: false,                     // indicates if the workout has a run
      total: 0,                       // the number of workouts selected
      swimLevel: -1,                  // swim difficulty selected
      bikeLevel: -1,                  // bike difficulty selected
      runLevel: -1,                   // run difficulty selected
      modalVal: -1,                   // value of the modal
      selectModalVisible: false,      // indicates if the workout selection modal is open
      workoutModalVisible: false,     // indicates if the workout completion modal is open
      day: 0,                         // the day the user is on in the plan
      dailyWorkout: [],               // today's entire workout
      chosenWorkout: [],              // the workout the user chose
      swimHows: [],                   // the workout's swim how to's
      bikeHows: [],                   // the workout's bike how to's
      runHows: [],                    // the workout's run how to's
      activeSlide: 0,                 // which carousel slide is being viewed
      completed: false                // indicates if the workout was completed
    }

    this.load = this.load.bind(this)
    this.readDayChanges = this.readDayChanges.bind(this)
    this.openModal = this.openModal.bind(this)
    this.select = this.select.bind(this)
    this.submit = this.submit.bind(this)
    this.prepareWorkout = this.prepareWorkout.bind(this)
    this.getHowTos = this.getHowTos.bind(this)
    this.complete = this.complete.bind(this)
    this.getWorkoutLevel = this.getWorkoutLevel.bind(this)
    this.getWorkout = this.getWorkout.bind(this)
    this.renderWorkout = this.renderWorkout.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this.renderButton = this.renderButton.bind(this)
  }

  componentDidMount() {
    this.load()
    this.readDayChanges()
  }

  // Loads the state with necessary information about the user's progress
  load() {
    var user = firebase.auth().currentUser
    var currDay;

    // Retrieve the relevant data from the user
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      currDay = snapshot.val().day
      // Retrieve the user's selected workouts to determine if the user has
      //  already chosen a workout for the current day
      var workouts = snapshot.val().selectedWorkouts || []
      var workout = workouts[currDay] || {}
      var swimLevel = workout.swimDifficulty || -1
      var bikeLevel = workout.bikeDifficulty || -1
      var runLevel = workout.runDifficulty || -1
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
        day: currDay,
        swimLevel: swimLevel,
        bikeLevel: bikeLevel,
        runLevel: runLevel
      })
    }).then(response => {
      // Retrieve the entire workout for the current day
      database.ref('/workouts/' + currDay).once('value').then(snapshot => {
        var rest = false
        // Identify if the workout is a rest day, in which case the user's
        //  database is updated with the workout
        if (!snapshot.val().swim && !snapshot.val().bike && !snapshot.val().run) {
          rest = true
          var choice = {
            day: currDay,
            completed: false,
            rest: rest
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

        // Count the number of workouts the user has chosen based on the database
        var total = 0
        if (snapshot.val().swim) {
          total = total + 1
        }
        if (snapshot.val().bike) {
          total = total + 1
        }
        if (snapshot.val().run) {
          total = total + 1
        }
        this.setState({
          rest: rest,
          completed: false,
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
      })
    })
  }

  // Ensure that whenever the day of the user is changed, this component
  //  updates its state, thereby re-rendering and updating the weekly
  //  affirmation if necessary
  readDayChanges() {
    var user = firebase.auth().currentUser
    firebase.database().ref('users/' + user.uid + '/day/').on('value', (snapshot) => {
      this.load()
    })
  }

  // Opens the modal corresponding to the parameter (0-8)
  openModal(val) {
    this.setState({
      modalVal: val,
      selectModalVisible: true
    })
  }

  // Selects the workout corresponding to the modal value by setting the level
  //  for that workout type accordingly; closes the modal
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
    var user = firebase.auth().currentUser
    // Count the number of workouts selected for the day
    var chosen = 0
    if (this.state.swimLevel > -1) {
      chosen = chosen + 1
    }
    if (this.state.bikeLevel > -1) {
      chosen = chosen + 1
    }
    if (this.state.runLevel > -1) {
      chosen = chosen + 1
    }

    // Ensure that the number of chosen workouts equals the number of required
    //  workouts
    if (this.state.total !== chosen) {
      alert('Select an option for each workout!')
    } else {
      // Store selection
      var choice = {
        completed: false,
        rest: false,
        day: this.state.day
      }

      // For each workout type, create an object that contains the type, the
      //  workout itself, the 'FOCUS' point of the wokrout, and the difficulty
      //  level
      if (this.state.swim) {
        choice['swim'] = true
        choice['swimWorkout'] = this.state.dailyWorkout.swim[this.state.swimLevel]
        choice['swimInfo'] = this.state.dailyWorkout.swimInfo || ''
        if (this.state.swimLevel === 0) {
          choice['swimDifficulty'] = 'Beginner'
        } else if (this.state.swimLevel === 1) {
          choice['swimDifficulty'] = 'Intermediate'
        } else if (this.state.swimLevel === 2) {
          choice['swimDifficulty'] = 'Advanced'
        }
      }
      if (this.state.bike) {
        choice['bike'] = true
        choice['bikeWorkout'] = this.state.dailyWorkout.bike[this.state.bikeLevel]
        choice['bikeInfo'] = this.state.dailyWorkout.bikeInfo || ''
        if (this.state.bikeLevel === 0) {
          choice['bikeDifficulty'] = 'Beginner'
        } else if (this.state.bikeLevel === 1) {
          choice['bikeDifficulty'] = 'Intermediate'
        } else if (this.state.bikeLevel === 2) {
          choice['bikeDifficulty'] = 'Advanced'
        }
      }
      if (this.state.run) {
        choice['run'] = true
        choice['runWorkout'] = this.state.dailyWorkout.run[this.state.runLevel]
        choice['runInfo'] = this.state.dailyWorkout.runInfo || ''
        if (this.state.runLevel === 0) {
          choice['runDifficulty'] = 'Beginner'
        } else if (this.state.runLevel === 1) {
          choice['runDifficulty'] = 'Intermediate'
        } else if (this.state.runLevel === 2) {
          choice['runDifficulty'] = 'Advanced'
        }
      }
      // Update the user's selected workouts data with the new chosen workout
      var updates = {}
      updates['/users/' + user.uid + '/selectedWorkouts/' + this.state.day] = choice
      firebase.database().ref().update(updates)
      .catch(error => {
        console.log('Error Updating: ' + error.message)
      })
      // Prepare the final workout modal via the following function
      this.prepareWorkout(choice)
    }
  }

  // Given the selected workout object, prepare the modal that displays the
  //  workout by filling the settings array, which the carousel in the modal
  //  requires
  prepareWorkout(choice) {
    var thisWorkout = []
    settings = []
    // For each workout type, create the current workout state variable,
    //  thisWorkout, and push the relevant information into the settings array
    //  for the carousel to read
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

  // Find the 'how to' items for each workout, given the type of workout
  getHowTos(l) {
    var user = firebase.auth().currentUser
    var list = []
    var typeA;
    var typeB;
    // Identify the relevant how to types that fit the workout type
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
      // Retrieve the matching how to's from the tutorials database
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

  // Mark the selected entry as complete
  complete() {
    // Update database to show completion for this user's selected workout
    var user = firebase.auth().currentUser
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

    // Increment day by one and increment it
    var updates = {}
    updates['/users/' + user.uid + '/day'] = this.state.day + 1
    firebase.database().ref().update(updates)
    .then(result => {
      this.load()
    })
    .catch(error => {
      console.log('Error Updating: ' + error.message)
    })

    // Hide workout completion modal
    this.setState({
      workoutModalVisible: false,
    })

    // Navigate to the journal page
    const { navigate } = this.props.navigation
    navigate('Journal')
  }

  // Given the modal value, identify the workout level in title form
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
    return title
  }

  // Given the modal value, retrieve the text of the workout at the relevant
  //  type and level
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
    return action
  }

  // Renders the text for each workout, alternating colors between lines
  renderWorkout(text, i) {
    // Alternate colors between bright blue and white
    var style;
    i % 2 ? style = styles.modalText: style = styles.modalTextYellow
    // Some of the workouts contain arrays to more detailed
    //  sets or workout components; this if statement
    //  determines whether to print a string or dive into
    //  a new level of the array
    if (typeof(text) === 'string') {
      return <Text key={i} style={style}>{text}</Text>
    } else {
      return (
        text.map((text2, i2) => {
          return <Text key={i2} style={style}>{text2}</Text>
        })
      )
    }
  }

  // Renders each slide of the carousel
  _renderItem ({item, index}) {
    var l = item.level[0]
    this.getHowTos(l)
    // Determine which how to's correspond to this slide of the carousel
    var list
    if (l === 'S') {
      list = this.state.swimHows
    } else if (l === 'B') {
      list = this.state.bikeHows
    } else if (l === 'R') {
      list = this.state.runHows
    }

    // Render the carousel slide, with the focus first, selected workout second,
    //  and how to's third
    if (index < settings.length) {
      return (
        <View style={styles.slideContainer}>
          <View key={index} style={styles.modalTextContainer}>
            <Text style={styles.modalTitle}>{item.level}</Text>
            <Text style={styles.modalInfo}>{'FOCUS: ' + item.info}</Text>
            <View style={styles.workoutContainer}>
              {item.text.map((action, i) => {
                return this.renderWorkout(action, i)
              })}
            </View>
            {list.length ? <Text style={styles.modalTitle}>Today's How To's:</Text> : null}
            {list.map((item, i) => {
              return <View key={i}>
                <Text style={styles.toTextYellow}>{item.text}</Text>
                <Text style={styles.toText}>{item.description}</Text>
                {item.category === 'gear' ?
                  <Text>MAP</Text> :
                  null
                }
                {item.category === 'video' ?
                  <Text>VIDEO</Text>
                  : null
                }
                <Text></Text>
              </View>
            })}
          </View>
        </View>
      )
    }
  }

  // Allows carousel to be scrolled through, changing the state to mirror
  //  which slide is being viewed
  _onScroll(index){
    this.setState({activeSlide: index})
  }

  // Controls the appearance of the dots indicating which slide of the carousel
  //  is being viewed
  get pagination () {
    const activeSlide = this.state.activeSlide
    return (
      <Pagination style={styles.pagination}
        dotsLength={settings.length}
        activeDotIndex={activeSlide}
      />
    )
  }

  // Renders each workout selector button, given the state variable for that
  //  workout type, the modal value, the difficulty level, and the text for
  //  the box
  renderButton(stateVar, i, level, text) {
    return (
      <TouchableOpacity
        onPress={() => this.openModal(i)}
        style={stateVar === level ? styles.levelBoxActive : styles.levelBox}>
        <Text style={styles.levelText}>{text}</Text>
      </TouchableOpacity>
    )
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

          {/* View for displaying clickable workout options */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>My Workout</Text>
          </View>
          {/* Check for a rest day */}
          {this.state.rest ?
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
              {/* Render the buttons for each of the day's workout options */}
              <Text style={styles.contentHeader}>Select your workout for day {this.state.day}:</Text>
              {this.state.swim ?
                <View style={styles.workoutGroup} id="swim">
                  <Text style={styles.workoutHeader}>Swim:</Text>
                  <View style={styles.levelSelectionBox}>
                    {this.renderButton(this.state.swimLevel, 0, 0, 'BEGINNER')}
                    {this.renderButton(this.state.swimLevel, 1, 1, 'INTERMED.')}
                    {this.renderButton(this.state.swimLevel, 2, 2, 'ADVANCED')}
                  </View>
                </View> :
                <View></View>
              }
              {this.state.bike ?
                <View style={styles.workoutGroup} id="bike">
                  <Text style={styles.workoutHeader}>Bike:</Text>
                  <View style={styles.levelSelectionBox}>
                    {this.renderButton(this.state.bikeLevel, 3, 0, 'BEGINNER')}
                    {this.renderButton(this.state.bikeLevel, 4, 1, 'INTERMED.')}
                    {this.renderButton(this.state.bikeLevel, 5, 2, 'ADVANCED')}
                  </View>
                </View> :
                <View></View>
              }
              {this.state.run ?
                <View style={styles.workoutGroup} id="run">
                  <Text style={styles.workoutHeader}>Run:</Text>
                  <View style={styles.levelSelectionBox}>
                    {this.renderButton(this.state.runLevel, 6, 0, 'BEGINNER')}
                    {this.renderButton(this.state.runLevel, 7, 1, 'INTERMED.')}
                    {this.renderButton(this.state.runLevel, 8, 2, 'ADVANCED')}
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

        {/* Modal screen for choosing workout option */}
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
                return this.renderWorkout(item, i)
              })}
            </View>
          </View>
          <TouchableOpacity
            onPress={this.select}
            style={styles.modalSubmit}>
            <Text style={styles.modalText}>Select</Text>
          </TouchableOpacity>
        </Modal>

        {/* Modal screen for viewing and completing chosen workout, complete
              with a carousel for scrolling between the days workout sections */}
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
    )
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
})
