import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal'
import { Ionicons } from '@expo/vector-icons';

import firebase from '../firebase';
var database = firebase.database();

import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

//STYLING NOTES:
// if not completed in the past, indicate it somehow
// change color of "todays workout" based on if its done or not
// change the styling of future days to look better without all the words
//if you click on previous workout, modal with all the info comes up


export default class TrainingPlanScreen extends React.Component {
  static navigationOptions = {
    title: 'Weekly Plan',
  };

  constructor(props) {
    super(props)
    this.state = {
      day: 0,
      pastWorkouts: [],
      todaysWorkout: {},
      todaysChoice: {},
      futureWorkouts: [],
      modalVal: -1,
      pastModalVisible: false,
      futModalVisible: false,
      temp: {},
      tempChoice: {}
    }

    this.load = this.load.bind(this)
    this.readDayChanges = this.readDayChanges.bind(this)
    this.readWorkoutChanges = this.readWorkoutChanges.bind(this)
    this.openPastModal = this.openPastModal.bind(this)
    this.openFutModal = this.openFutModal.bind(this)
    this.redirect = this.redirect.bind(this)
    this.getTodaysWorkout = this.getTodaysWorkout.bind(this)
    this.getWorkouts = this.getWorkouts.bind(this)
    this.getChoice = this.getChoice.bind(this)
    this.getOptions = this.getOptions.bind(this)
    this.getJournal = this.getJournal.bind(this)
  }

  componentDidMount() {
    this.load()
    this.readDayChanges()
    this.readWorkoutChanges()
  }

  load() {
    var user = firebase.auth().currentUser;
    var maxDays = 70
    var currDay;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      currDay = snapshot.val().day
      this.setState({day: snapshot.val().day})
      var workouts = snapshot.val().selectedWorkouts
      var chosen = {}
      var past = []
      var future = []
      if (workouts) {
        chosen = workouts[currDay] || {}
        for (var i = 1; i < currDay; i++) {
          var item = workouts[i]
          if (item && item.day) {
            past[item.day] = item
          }
        }
        for (var i = currDay + 1; i < 70; i++) {
          var item = workouts[i]
          if (item && item.day) {
            future[item.day] = item
          }
        }
      }
      this.setState({
        pastWorkouts: past,
        futureWorkouts: future,
        todaysChoice: chosen
      })
    })
    .then(response => {
      database.ref('/workouts/' + currDay).once('value').then(snapshot => {
        this.setState({todaysWorkout: snapshot.val()})
      });
    })
    .then(response => {
      var past = this.state.pastWorkouts
      var future = this.state.futureWorkouts
      database.ref('/workouts/').once('value').then(snapshot => {
        var allWorkouts = snapshot.val();
        allWorkouts.forEach(item => {
          if (item.day < this.state.day && !past[item.day]) {
            past[item.day] = item
          } else if (item.day > this.state.day && !future[item.day]) {
            future[item.day] = item
          }
        })
        this.setState({
          pastWorkouts: past,
          futureWorkouts: future
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

  readWorkoutChanges() {
    var user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid + '/selectedWorkouts/').on('value', (snapshot) => {
      this.load()
    });
  }

  openPastModal(val) {
    var user = firebase.auth().currentUser;
    database.ref('/users/' + user.uid + '/selectedWorkouts/').once('value').then(snapshot => {
      var today = snapshot.val()[val]
      this.setState({
        modalVal: val,
        pastModalVisible: true,
        tempChoice: today
      })
    })
    database.ref('/workouts/').once('value').then(snapshot => {
      var today = snapshot.val()[val]
      this.setState({
        temp: today
      })
    })
  }

  openFutModal(val) {
    database.ref('/workouts/').once('value').then(snapshot => {
      var today = snapshot.val()[val]
      this.setState({
        modalVal: val,
        futModalVisible: true,
        temp: today
      })
    })

  }

  redirect() {
    const { navigate } = this.props.navigation
    navigate('MyWorkout')
  }

  getWorkouts(list, past) {
    var workoutList = list.map((workout, day) => {
      var weekday = workout.day % 7
      var weekdayPrint
      if (!weekday) {
        weekdayPrint = 7
      } else if (weekday === 1) {
        weekdayPrint = '1 of this week'
      } else {
        weekdayPrint = weekday
      }
      var week = workout.day / 7

      if (!workout.swim && !workout.bike && !workout.run) {
        var containerStyle = workout.completed ? styles.restDayWorkoutContainer : styles.futureRestDayWorkoutContainer
        var textStyle = workout.completed ? styles.restDayWorkoutText : styles.futureRestDayWorkoutText
        return (
          <TouchableOpacity
            key={day}
            style={containerStyle}
            onPress={workout.completed ? null : () => this.switch(workout.day)}>
            <Text style={textStyle}>REST DAY</Text>
          </TouchableOpacity>
        )
      } else {
        var complete = workout.completed
        var containerStyle = complete ? styles.completedWorkoutContainer : styles.workoutContainer
        var textStyle = complete ? styles.completedWorkoutDate : styles.workoutDate
        var iconName = Platform.OS === 'ios' ? `ios-create${'-outline'}` : 'md-create';
        return (
          <View key={day}>
            {weekday === 1 ? <Text style={styles.week}>WEEK {Math.ceil(week)}</Text> : null}
            <TouchableOpacity
              style={containerStyle}
              onPress={() => complete ? this.openPastModal(workout.day) : this.openFutModal(workout.day)}>
              <Text style={textStyle}>DAY {workout.day} ({weekdayPrint})</Text>
              {complete ?
                <View style={styles.workoutPlanContainer}>
                  {(workout.hasOwnProperty('swimDifficulty')) ?
                    <View style={styles.eachWorkoutContainer}>
                      <Image
                        source={require('../assets/images/swim.png')}
                        style={styles.activityIcon}/>
                      <Text style={styles.workoutWorkout}>{workout.swimDifficulty.substring(0, 5)}.</Text>
                    </View> : null
                  }
                  {(workout.hasOwnProperty('bikeDifficulty')) ?
                    <View style={styles.eachWorkoutContainer}>
                      <Image
                        source={require('../assets/images/bike.png')}
                        style={styles.activityIcon}/>
                      <Text style={styles.workoutWorkout}>{workout.bikeDifficulty.substring(0, 5)}.</Text>
                    </View> : null
                  }
                  {(workout.hasOwnProperty('runDifficulty')) ?
                    <View style={styles.eachWorkoutContainer}>
                      <Image
                        source={require('../assets/images/run.png')}
                        style={styles.activityIcon}/>
                      <Text style={styles.workoutWorkout}>{workout.runDifficulty.substring(0, 5)}.</Text>
                    </View> : null
                  }
                  {(workout.hasOwnProperty('journal')) ?
                    <View style={styles.imageContainer}>
                      <Ionicons
                        name={iconName}
                        size={28}
                        style={{ marginBottom: -3 }}
                        color={Colors.ourYellow}/>
                    </View> : null
                  }
                </View> :
                <View style={styles.workoutPlanContainer}>
                  {(workout.swim) ?
                    <View style={styles.eachWorkoutContainer}>
                      <Image
                        source={require('../assets/images/swim.png')}
                        style={styles.activityIcon}/>
                    </View> : null
                  }
                  {(workout.bike) ?
                    <View style={styles.eachWorkoutContainer}>
                      <Image
                        source={require('../assets/images/bike.png')}
                        style={styles.activityIcon}/>
                    </View> : null
                  }
                  {(workout.run) ?
                    <View style={styles.eachWorkoutContainer}>
                      <Image
                        source={require('../assets/images/run.png')}
                        style={styles.activityIcon}/>
                    </View> : null
                  }
                </View>
              }
            </TouchableOpacity>
          </View>
        )
      }
    })
    return workoutList
  }

  getTodaysWorkout() {
    var todaysWorkout
    var weekday = this.state.day % 7
    var weekdayPrint
    if (!weekday) {
      weekdayPrint = 7
    } else if (weekday === 1) {
      weekdayPrint = '1 of this week'
    } else {
      weekdayPrint = weekday
    }
    var week = this.state.day / 7
    if (!this.state.todaysWorkout.run && !this.state.todaysWorkout.bike && !this.state.todaysWorkout.swim){
      todaysWorkout = (
        <TouchableOpacity
          style={styles.futureRestDayWorkoutContainer}
          onPress={() => this.redirect()}>
          <Text style={styles.futureRestDayWorkoutText}>TODAY: REST DAY</Text>
        </TouchableOpacity>
      )
    } else {
      var chosen = this.state.todaysChoice
      todaysWorkout = (
        <View>
          {weekday === 1 ? <Text style={styles.week}>WEEK {Math.ceil(week)}</Text> : null}
          <TouchableOpacity
            style={styles.todaysWorkoutContainer}
            onPress={() => this.redirect()}>
            <Text style={styles.workoutDate}>TODAY ({weekdayPrint})</Text>
            <View style={styles.workoutPlanContainer}>
              {(this.state.todaysWorkout.swim) ?
                <View style={styles.eachWorkoutContainer}>
                  <Image
                    source={require('../assets/images/swim.png')}
                    style={styles.activityIcon}/>
                  {chosen.hasOwnProperty('swimDifficulty') ?
                  <Text style={styles.workoutWorkout}>{this.state.todaysChoice.swimDifficulty.substring(0, 5)}.</Text>
                  : null}
                </View> : null
              }
              {(this.state.todaysWorkout.bike) ?
                <View style={styles.eachWorkoutContainer}>
                  <Image
                    source={require('../assets/images/bike.png')}
                    style={styles.activityIcon}/>
                  {chosen.hasOwnProperty('bikeDifficulty') ?
                  <Text style={styles.workoutWorkout}>{this.state.todaysChoice.bikeDifficulty.substring(0, 5)}.</Text>
                  : null}
                </View> : null
              }
              {(this.state.todaysWorkout.run) ?
                <View style={styles.eachWorkoutContainer}>
                  <Image
                    source={require('../assets/images/run.png')}
                    style={styles.activityIcon}/>
                  {chosen.hasOwnProperty('runDifficulty') ?
                  <Text style={styles.workoutWorkout}>{this.state.todaysChoice.runDifficulty.substring(0, 5)}.</Text>
                  : null}
                </View> : null
              }
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return todaysWorkout
  }

  getChoice(val) {
    var list = []
    if (this.state.temp.hasOwnProperty('swimWorkout')) {
      list[0] = {
        title: 'SWIM: Beginner',
        workout: this.state.temp.swimWorkout[0],
        chosen: false
      }
      list[1] = {
        title: 'SWIM: Intermediate',
        workout: this.state.temp.swimWorkout[1],
        chosen: false
      }
      list[2] = {
        title: 'SWIM: Advanced',
        workout: this.state.temp.swimWorkout[2],
        chosen: false
      }
      if (this.state.tempChoice.swimDifficulty === "Beginner") {
        list[0]['chosen'] = true
      } else if (this.state.tempChoice.swimDifficulty === "Intermediate") {
        list[1]['chosen'] = true
      } else {
        list[2]['chosen'] = true
      }
    }
    if (this.state.temp.hasOwnProperty('bikeWorkout')) {
      list[3] = {
        title: 'BIKE: Beginner',
        workout: this.state.temp.bikeWorkout[0],
        chosen: false
      }
      list[4] = {
        title: 'BIKE: Intermediate',
        workout: this.state.temp.bikeWorkout[1],
        chosen: false
      }
      list[5] = {
        title: 'BIKE: Advanced',
        workout: this.state.temp.bikeWorkout[2],
        chosen: false
      }
      if (this.state.tempChoice.bikeDifficulty === "Beginner") {
        list[3]['chosen'] = true
      } else if (this.state.tempChoice.bikeDifficulty === "Intermediate") {
        list[4]['chosen'] = true
      } else {
        list[5]['chosen'] = true
      }
    }
    if (this.state.temp.hasOwnProperty('runWorkout')) {
      list[6] = {
        title: 'RUN: Beginner',
        workout: this.state.temp.runWorkout[0],
        chosen: false
      }
      list[7] = {
        title: 'RUN: Intermediate',
        workout: this.state.temp.runWorkout[1],
        chosen: false
      }
      list[8] = {
        title: 'RUN: Advanced',
        workout: this.state.temp.runWorkout[2],
        chosen: false
      }
      if (this.state.tempChoice.runDifficulty === "Beginner") {
        list[6]['chosen'] = true
      } else if (this.state.tempChoice.runDifficulty === "Intermediate") {
        list[7]['chosen'] = true
      } else {
        list[8]['chosen'] = true
      }
    }
    return list
  }

  getOptions(val) {
    var list = []
    if (this.state.temp.hasOwnProperty('swimWorkout')) {
      list.push({
        title: 'SWIM: Beginner',
        workout: this.state.temp.swimWorkout[0]
      })
      list.push({
        title: 'SWIM: Intermediate',
        workout: this.state.temp.swimWorkout[1]
      })
      list.push({
        title: 'SWIM: Advanced',
        workout: this.state.temp.swimWorkout[2]
      })
    }
    if (this.state.temp.hasOwnProperty('bikeWorkout')) {
      list.push({
        title: 'BIKE: Beginner',
        workout: this.state.temp.bikeWorkout[0]
      })
      list.push({
        title: 'BIKE: Intermediate',
        workout: this.state.temp.bikeWorkout[1]
      })
      list.push({
        title: 'BIKE: Advanced',
        workout: this.state.temp.bikeWorkout[2]
      })
    }
    if (this.state.temp.hasOwnProperty('runWorkout')) {
      list.push({
        title: 'RUN: Beginner',
        workout: this.state.temp.runWorkout[0]}
      )
      list.push({
        title: 'RUN: Intermediate',
        workout: this.state.temp.runWorkout[1]
      })
      list.push({
        title: 'RUN: Advanced',
        workout: this.state.temp.runWorkout[2]
      })
    }
    return list
  }

  getJournal() {
    var journ = this.state.tempChoice.journal || []
    var list = []
    journ.forEach((entry, i) => {
      var title
      if (i === 0) {
        title = 'Training:'
      } else if (i === 1) {
        title = 'Nutrition:'
      } else {
        title = 'Race Day:'
      }
      if (entry) {
        list.push({
          title: title,
          text: entry
        })
      }
    })
    return list
  }

  switch(val) {
    var user = firebase.auth().currentUser;
    var updates = {}
    updates['/users/' + user.uid + '/day/'] = val
    firebase.database().ref().update(updates)
    .then(result => {
      this.setState({
        futModalVisible: false,
        day: val
      })
      const { navigate } = this.props.navigation
      navigate('MyWorkout')
    })
    .catch(error => {
      console.log('Error Updating: ' + error.message)
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
            <Text style={styles.headerText}>Weekly Plan</Text>
          </View>
          <View style={styles.contentContainer}>
            {this.getWorkouts(this.state.pastWorkouts, true)}
            {this.getTodaysWorkout()}
            {this.getWorkouts(this.state.futureWorkouts, false)}
          </View>
        </View>

        <Modal
          isVisible={this.state.pastModalVisible}
          style={styles.yellowModalContainer}>
          <ScrollView>
            <View style={styles.modalExitContainer}>
              <TouchableOpacity
                onPress={() => this.setState({pastModalVisible: false})}
                style={styles.yellowModalExit}>
                  <Text style={styles.modalText}>x</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHeader}>What You Did:</Text>
            <View style={styles.modalTextContainer}>
              <Text style={styles.yellowModalTitle}>Day {this.state.modalVal}</Text>
              {this.getChoice(this.state.modalVal).map((item, j) => {
                if (item) {
                  var boxStyle = item.chosen ? styles.workoutBoxChosen : styles.workoutBox
                  var titleStyle = item.chosen ? styles.greenModalLabel : styles.labelChosen
                  var title = item.chosen ? 'You Chose ' + item.title : item.title
                  return (
                    <View key={j}>
                      <Text style={titleStyle}>{title}</Text>
                      <View style={boxStyle}>
                        {item.workout.map((text, i) => {
                          var style;
                          if (i % 2 === 0) {
                            style = styles.modalTextYellow
                          } else {
                            style = styles.modalText
                          }
                          if (typeof(text) === 'string') {
                            return <Text key={i} style={style}>{text}</Text>
                          } else {
                            return (
                              text.map((text2, i2) => {
                                return <Text key={i2} style={style}>{text2}</Text>
                              })
                            )
                          }
                        })}
                      </View>
                      {item.title[item.title.length - 1] === 'd' ?
                      <Text></Text>
                      : null}
                    </View>
                  )
                }
              })}
              {this.getJournal().map((entry, i) => {
                return (
                  <View key={i}>
                    <Text style={styles.greenModalLabel}>{entry.title}</Text>
                    <Text style={styles.modalText}>{entry.text}</Text>
                  </View>
                )
              })}
            </View>
          </ScrollView>
        </Modal>

        <Modal
          isVisible={this.state.futModalVisible}
          style={styles.greenModalContainer}>
          <ScrollView>
            <View style={styles.modalExitContainer}>
              <TouchableOpacity
                onPress={() => this.setState({futModalVisible: false})}
                style={styles.greenModalExit}>
                  <Text style={styles.modalText}>x</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHeader}>What You'll Do:</Text>
            <View style={styles.modalTextContainer}>
              <Text style={styles.greenModalTitle}>Day {this.state.modalVal}</Text>
              {this.getOptions(this.state.modalVal).map((item, j) => {
                return (
                  <View key={j}>
                    <Text style={styles.greenModalLabel}>{item.title}</Text>
                    <View style={styles.workoutBox}>
                      {item.workout.map((text, i) => {
                        var style;
                        if (i % 2 === 0) {
                          style = styles.modalTextYellow
                        } else {
                          style = styles.modalText
                        }
                        if (typeof(text) === 'string') {
                          return <Text key={i} style={style}>{text}</Text>
                        } else {
                          return (
                            text.map((text2, i2) => {
                              return <Text key={i2} style={style}>{text2}</Text>
                            })
                          )
                        }
                      })}
                    </View>
                    {item.title[item.title.length - 1] === 'd' ?
                    <Text></Text>
                    : null}
                  </View>
                )
              })}
            </View>
            <TouchableOpacity
              onPress={() => this.switch(this.state.modalVal)}
              style={styles.modalSubmit}>
              <Text style={styles.modalText}>Skip to Day {this.state.modalVal}</Text>
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
    backgroundColor: Colors.ourGreen,
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
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    width: screenWidth
  },
  workoutContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.ourGreen,
    height: 80,
    width: 280,
    borderRadius: 5,
    padding: 5
  },
  todaysWorkoutContainer: {
    marginTop: 15,
    borderWidth: 3,
    borderColor: Colors.ourGreen,
    height: 80,
    width: 280,
    borderRadius: 5,
    padding: 5
  },
  completedWorkoutContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.ourYellow,
    height: 80,
    width: 280,
    borderRadius: 5,
    padding: 5
  },
  restDayWorkoutContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.ourYellow,
    height: 30,
    width: 280,
    borderRadius: 5
  },
  restDayWorkoutText: {
    textAlign: 'center',
    fontSize: 17,
    marginTop: 3,
    color: Colors.ourYellow,
    fontWeight: 'bold',
    fontStyle: 'italic',
    backgroundColor: 'transparent'
  },
  futureRestDayWorkoutContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.ourGreen,
    height: 30,
    width: 280,
    borderRadius: 5
  },
  futureRestDayWorkoutText: {
    textAlign: 'center',
    fontSize: 17,
    marginTop: 3,
    color: Colors.ourGreen,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  week: {
    fontFamily: 'kalam-bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingTop: 15
  },
  workoutDate: {
    textAlign: 'left',
    fontSize: 17,
    color: Colors.ourGreen,
    fontWeight: 'bold',
    fontStyle: 'italic',
    backgroundColor: 'transparent',
    marginBottom: 4
  },
  completedWorkoutDate: {
    textAlign: 'left',
    fontSize: 17,
    color: Colors.ourYellow,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginBottom: 4
  },
  workoutWorkout: {
    textAlign: 'left',
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'white',
    backgroundColor: 'transparent'
  },
  activityIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  workoutPlanContainer: {
    marginTop: 5,
    width: 270,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  eachWorkoutContainer: {
    flex: 2,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  imageContainer: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  greenModalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.ourGrey,
    borderColor: Colors.ourGreen,
    borderWidth: 5,
    borderRadius: 5,
  },
  yellowModalContainer: {
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
  greenModalExit: {
    display: 'flex',
    justifyContent: 'center',
    borderColor: Colors.ourGrey,
    backgroundColor: Colors.ourGreen,
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
    width: 30,
    height: 30,
  },
  yellowModalExit: {
    display: 'flex',
    justifyContent: 'center',
    borderColor: Colors.ourGrey,
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
  modalTextGreen: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Colors.ourGreen,
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
  greenModalTitle: {
    fontFamily: 'kalam-bold',
    fontSize: 22,
    color: Colors.ourGreen,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  yellowModalTitle: {
    fontFamily: 'kalam-bold',
    fontSize: 22,
    color: Colors.ourYellow,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  greenModalLabel: {
    fontFamily: 'kalam-bold',
    fontSize: 20,
    color: Colors.ourGreen,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  labelChosen: {
    fontFamily: 'kalam-bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  workoutBox: {
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.ourGreen,
    borderRadius: 5,
    padding: 5
  },
  workoutBoxChosen: {
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: Colors.ourYellow,
    borderRadius: 5,
    padding: 5,
    backgroundColor: Colors.ourBackgroundGrey
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
    borderColor: Colors.ourGreen,
    backgroundColor: Colors.ourGreen,
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
});
