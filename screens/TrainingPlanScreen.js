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

import Colors from '../constants/Colors';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const workouts = [
  {date: 'TODAY', bike: '5 miles', swim: 'none', run: 'none'},
  {date: 'TOMORROW', bike: 'none', swim: '1 mile', run: 'none'},
  {date: 'THURSDAY', bike: '15 miles', swim: 'none', run: '2 miles'},
  {date: 'FRIDAY', bike: 'none', swim: 'none', run: 'none'},
  {date: 'MONDAY', bike: 'none', swim: '4 miles', run: 'none'},
]


export default class TrainingPlanScreen extends React.Component {
  static navigationOptions = {
    title: 'The Plan',
  };

  render() {
    var workoutList =
      workouts.map(workout => {
        if(workout.bike === 'none' && workout.swim === 'none' && workout.run === 'none'){
          return(
            <View key={workout.date} style={styles.restDayWorkoutContainer}>
              <Text style={styles.restDayWorkoutText}>REST DAY</Text>
            </View>
          )
        } else {
          return(
            <View key={workout.date} style={styles.workoutContainer}>
              <Text style={styles.workoutDate}>{workout.date}</Text>
                <View style={styles.workoutPlanContainer}>
                  {(workout.run !== 'none') ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/run.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{workout.run}</Text></View> : <View></View>}
                  {(workout.bike !== 'none') ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/bike.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{workout.bike}</Text></View> : <View></View>}
                  {(workout.swim !== 'none') ? <View style={styles.eachWorkoutContainer}><Image source={require('../assets/images/swim.png')} style={styles.activityIcon}/><Text style={styles.workoutWorkout}>{workout.swim}</Text></View> : <View></View>}
                </View>
            </View>
          )
        }
      })

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
            <Text style={styles.headerText}>The Plan</Text>
          </View>
          <View style={styles.contentContainer}>
            {workoutList}
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
    backgroundColor: 'transparent'
  },
  workoutDate: {
    textAlign: 'left',
    fontSize: 17,
    color: Colors.ourGreen,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginBottom: 4
  },
  workoutWorkout: {
    textAlign: 'left',
    fontSize: 17,
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
