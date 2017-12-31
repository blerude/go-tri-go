import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';import { ExpoLinksView } from '@expo/samples';

import firebase from '../firebase';
var database = firebase.database();

import Colors from '../constants/Colors';
import { Dimensions } from 'react-native';

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
      completedWorkouts: [],
      todaysWorkout: {},
      todaysChoice: {},
      futureWorkouts: []
    }
    this.load = this.load.bind(this)
    this.readDayChanges = this.readDayChanges.bind(this)
    this.readWorkoutChanges = this.readWorkoutChanges.bind(this)
  }

  componentDidMount() {
    this.load()
    this.readDayChanges()
    this.readWorkoutChanges()
  }

  load() {
    var user = firebase.auth().currentUser;
    var currDay;
    database.ref('/users/' + user.uid).once('value').then(snapshot => {
      currDay = snapshot.val().day
      this.setState({day: snapshot.val().day})
      var workouts = snapshot.val().selectedWorkouts
      var chosen = {}
      var completed = []
      if (workouts) {
        console.log('w', workouts)
        chosen = workouts[currDay] ? workouts[currDay] : {}
        for (var key in workouts) {
          var item = workouts[key]
          if (item.day && item.day !== currDay) {
            completed.push(item)
          }
        }
      }
      this.setState({
        completedWorkouts: completed,
        todaysChoice: chosen
      })
    })
    .then(response => {
      database.ref('/workouts/' + currDay).once('value').then(snapshot => {
        this.setState({todaysWorkout: snapshot.val()})
      });
    })
    .then(response => {
      var futureWorkoutArray = [];
      database.ref('/workouts/').once('value').then(snapshot => {
        var allWorkouts = snapshot.val();
        allWorkouts.forEach((workout, day) => {
          if (workout.day > this.state.day){
            futureWorkoutArray[workout.day] = workout
          }
        })
        this.setState({futureWorkouts: futureWorkoutArray})
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

  render() {
    var futureWorkoutList =
    this.state.futureWorkouts.map((workout, day) => {
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
      if(workout.bike === false && workout.swim === false && workout.run === false){
        return(
          <View key={day} style={styles.futureRestDayWorkoutContainer}>
            <Text style={styles.futureRestDayWorkoutText}>REST DAY</Text>
          </View>
        )
      } else {
        return(
          <View key={day}>
            {weekday === 1 ? <Text style={styles.week}>WEEK {Math.ceil(week)}</Text> : null}
            <TouchableOpacity style={styles.workoutContainer}>
              <Text style={styles.workoutDate}>DAY {workout.day} ({weekdayPrint})</Text>
              <View style={styles.workoutPlanContainer}>
                {(workout.run) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/run.png')} style={styles.activityIcon}/></View> : null}
                {(workout.bike) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/bike.png')} style={styles.activityIcon}/></View> : null}
                {(workout.swim) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/swim.png')} style={styles.activityIcon}/></View> : null}
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    })

    var completedWorkoutList =
    this.state.completedWorkouts.map((workout, day) => {
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
      if (workout.rest){
        return(
          <View key={day} style={styles.restDayWorkoutContainer}>
            <Text style={styles.restDayWorkoutText}>REST DAY</Text>
          </View>
        )
      } else {
        return(
          <View key={day}>
            {weekday === 1 ? <Text style={styles.week}>WEEK {Math.ceil(week)}</Text> : null}
            <TouchableOpacity style={styles.completedWorkoutContainer}>
              <Text style={styles.completedWorkoutDate}>DAY {workout.day} ({weekdayPrint})</Text>
              <View style={styles.workoutPlanContainer}>
                {(workout.hasOwnProperty('runDifficulty')) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/run.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{workout.runDifficulty}</Text></View> : <View></View>}
                {(workout.hasOwnProperty('bikeDifficulty')) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/bike.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{workout.bikeDifficulty}</Text></View> : <View></View>}
                {(workout.hasOwnProperty('swimDifficulty')) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/swim.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{workout.swimDifficulty}</Text></View> : <View></View>}
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    })

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
    if (this.state.todaysWorkout.run === false && this.state.todaysWorkout.bike === false && this.state.todaysWorkout.swim === false){
      var todaysWorkout = (
        <View style={styles.restDayWorkoutContainer}>
          <Text style={styles.restDayWorkoutText}>TODAY: REST DAY</Text>
        </View>
      )
    } else {
      var todaysWorkout = (
        <View>
          {weekday === 1 ? <Text style={styles.week}>WEEK {Math.ceil(week)}</Text> : null}
          <TouchableOpacity style={styles.workoutContainer}>
            <Text style={styles.workoutDate}>TODAY ({weekdayPrint})</Text>
            <View style={styles.workoutPlanContainer}>
              {(this.state.todaysWorkout.run === true) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/run.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{this.state.todaysChoice.runDifficulty}</Text></View> : null}
              {(this.state.todaysWorkout.bike === true) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/bike.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{this.state.todaysChoice.bikeDifficulty}</Text></View> : null}
              {(this.state.todaysWorkout.swim === true) ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/swim.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{this.state.todaysChoice.swimDifficulty}</Text></View> : null}
            </View>
          </TouchableOpacity>
        </View>
      )
    }

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
            {completedWorkoutList}
            {todaysWorkout}
            {futureWorkoutList}
          </View>
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
    width: 80,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  }
});
