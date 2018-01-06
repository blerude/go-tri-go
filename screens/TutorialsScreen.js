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
} from 'react-native';import { ExpoLinksView } from '@expo/samples';

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const instructions = [
  'Training for a triathlon and managing three sports at once can be a bit of a "three ring circus"',
  'GO-TRI-GO takes your training week and maps it out for you: specific workouts with a specific focus. Training with a purpose and having a well-thought-out and progressive program is the key to success at any level or distance.',
  'This plan is unique in that each every day YOU choose the level of training that best fits your skill and fitness levels. If you are just starting to train for your first Sprint Triathlon then choose to start with the Beginner workouts. If you have an extensive sports background, then choose from the Intermediate or Advanced workouts.',
  'For example, say you are a strong cyclist but a weak swimmer. You would choose the advanced cycling workout and the beginner swim workout. This way, you can continue to maintain your cycling fitness as you work to build your swimming skill and speed to a higher level.',
  'GO-TRI-GO is a foundational program from which you can learn the tricks and terminology of the sport, things like a proper wet suit fit. Where to start on the beach? How should I set up my transition area (the fourth event)? What is a "brick"?',
  "In your Weekly Plan, you can look at previous workouts you chose (in yellow) as well as preview future workouts (in green). Need to switch the order of workouts around? Just click on the workout you'd rather do and skip back and forth between days.",
  'Finally, write journal entries to track how you feel, what you ate, what went well during your workout, what you should remember on race day, and more!',
  'And remember, "Success will come from planning your work and working your plan!" Have fun!',
  '---Katie and the GO-TRI-GO team'
]

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "How To's",
    color: 'white'
  };

  constructor(props) {
    super(props)
    this.state = {
      tuts: [],
      showI: false,
      showS: false,
      showB: false,
      showR: false,
      showT: false
    }
    this.getList = this.getList.bind(this)
    this.setNewState = this.setNewState.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.renderInstructions = this.renderInstructions.bind(this)
    this.renderGroup = this.renderGroup.bind(this)
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    database.ref('/tutorials/').once('value').then(snapshot => {
      this.setState({
        tuts: snapshot.val()
      })
    })
  }

  getList(type, category) {
    var list = []
    this.state.tuts.forEach(day => {
      day.forEach(item => {
        if (item.type === type && item.category === category) {
          list.push(item)
        }
      })
    })

    var sortedList = list.sort((a, b) => {
      return a.text > b.text
    })
    // list.forEach(item => {
    //   var added = false
    //   for (var i = 0; i < sortedList.length; i++) {
    //     var curr = sortedList[i]
    //     if () {
    //       added = true
    //       sortedList.push(item)
    //     }
    //   }
    //   if (!added) {
    //     sortedList.push(item)
    //   }
    // })

    return sortedList
  }

  setNewState(newVar) {
    if (newVar === 'showS') {
      this.setState({
        showS: !this.state.showS
      })
    } else if (newVar === 'showB') {
      this.setState({
        showB: !this.state.showB
      })
    } else if (newVar === 'showR') {
      this.setState({
        showR: !this.state.showR
      })
    } else if (newVar === 'showT') {
      this.setState({
        showT: !this.state.showT
      })
    } else if (newVar === 'showI') {
      this.setState({
        showI: !this.state.showI
      })
    }
  }

  getTitle(newVar, type) {
    var title = ''
    if (newVar === 'showS') {
      this.state.showS ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    } else if (newVar === 'showB') {
      this.state.showB ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    } else if (newVar === 'showR') {
      this.state.showR ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    } else if (newVar === 'showT') {
      this.state.showT ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    }
    return title
  }

  getState(stateVar) {
    var ourVar = ''
    if (stateVar === 'showS') {
      ourVar = this.state.showS
    } else if (stateVar === 'showB') {
      ourVar = this.state.showB
    } else if (stateVar === 'showR') {
      ourVar = this.state.showR
    } else if (stateVar === 'showT') {
      ourVar = this.state.showT
    }
    return ourVar
  }

  renderInstructions(stateVar) {
    return <View style={styles.groupContainer}>
      <TouchableOpacity
        onPress={() => this.setNewState(stateVar)}>
          {this.state.showI ?
            <Text style={styles.title}>Instructions: &and;</Text> :
            <Text style={styles.title}>Instructions: &or;</Text>
          }
      </TouchableOpacity>
      {this.state.showI ?
        <View>
          {instructions.map((item, i) => {
            var style;
            i % 2 ? style = styles.toTextBright : style = styles.toText
            return <View key={i}>
              <Text style={style}>{item}</Text>
              <Text></Text>
            </View>
          })}
        </View>
        : null
      }
    </View>
  }

  renderGroup(type, stateVar, getVar) {
    return <View style={styles.groupContainer}>
      <TouchableOpacity
        onPress={() => this.setNewState(stateVar)}>
          {this.getTitle(stateVar, type)}
      </TouchableOpacity>
      {this.getState(stateVar) ?
        <View>
          <Text style={styles.label}>Vocabulary</Text>
          {this.getList(getVar, 'vocabulary').map((item, i) => {
            return <View key={i}>
              <Text style={styles.toTextBright}>{item.text} ({'Day ' + item.day})</Text>
              <Text style={styles.toText}>{item.description}</Text>
              <Text></Text>
            </View>
          })}
          <Text style={styles.label}>Gear</Text>
          {this.getList(getVar, 'gear').map((item, i) => {
            return <View key={i}>
              <Text style={styles.toTextBright}>{'Day ' + item.day + ': ' + item.text}</Text>
              <Text style={styles.toText}>{item.description}</Text>
              <Text>MAP</Text>
              <Text></Text>
            </View>
          })}
          <Text style={styles.label}>Videos</Text>
          {this.getList(getVar, 'video').map((item, i) => {
            return <View key={i}>
              <Text style={styles.toTextBright}>{'Day ' + item.day + ': ' + item.text}</Text>
              <Text style={styles.toText}>{item.description}</Text>
              <Text>VIDEO</Text>
              <Text></Text>
            </View>
          })}
        </View>
        : null
      }
    </View>
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
            <Text style={styles.headerText}>How To's</Text>
          </View>
          <View style={styles.contentContainer}>
            {this.renderInstructions('showI')}
            <Text></Text>
            {this.renderGroup('Swim', 'showS', 'swim')}
            {this.renderGroup('Bike', 'showB', 'bike')}
            {this.renderGroup('Run', 'showR', 'run')}
            {this.renderGroup('Transitions', 'showT', 'transition')}
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
    backgroundColor: Colors.ourBright,
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
    marginTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    width: screenWidth
  },
  groupContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.ourBright,
    padding: 10,
    marginBottom: 10
  },
  title: {
    fontFamily: 'kalam-bold',
    fontSize: 24,
    color: Colors.ourBright,
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
  toText: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'justify',
    backgroundColor: 'transparent',
    paddingBottom: 4
  },
  toTextBright: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: Colors.ourBright,
    textAlign: 'justify',
    backgroundColor: 'transparent',
    paddingBottom: 4
  },
});
