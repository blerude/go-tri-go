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

import firebase from '../firebase';
var database = firebase.database();

import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Content for the 'Instructions' section of the How To page
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
  }

  constructor(props) {
    super(props)
    this.state = {
      hows: [],       // array of how to's
      showI: false,   // indicates if instruction block is shown
      showS: false,   // indicates if swim block is shown
      showB: false,   // indicates if bike block is shown
      showR: false,   // indicates if run block is shown
      showT: false    // indicates if transition block is shown
    }

    this.getList = this.getList.bind(this)
    this.setNewState = this.setNewState.bind(this)
    this.getState = this.getState.bind(this)
    this.renderEntry = this.renderEntry.bind(this)
    this.renderInstructions = this.renderInstructions.bind(this)
    this.renderGroup = this.renderGroup.bind(this)
  }

  componentDidMount() {
    var user = firebase.auth().currentUser
    database.ref('/tutorials/').once('value').then(snapshot => {
      // Load how to's into the state array
      this.setState({
        hows: snapshot.val()
      })
    })
  }

  // Compiles list of tutorials, in alphabetical order, based on the given type
  //  (swim, bike, etc.) and category (vocab, gear, etc.)
  getList(type, category) {
    var list = []
    // Gather necessary items from the 'how to' array based on type and category
    this.state.hows.forEach(day => {
      day.forEach(item => {
        if (item.type === type && item.category === category) {
          list.push(item)
        } else if (type === 'transition' && item.category === category) {
          // Handle the transition mismatches
          if (item.type === 'swim/bike' || item.type === 'bike/run') {
            list.push(item)
          }
        }
      })
    })

    // Sort alphabetically
    var sortedList = list.sort((a, b) => {
      return a.text > b.text
    })

    return sortedList
  }

  // Depending on which block was touched, which is determined by the state
  //  variable given as a parameter, toggle that value to show or hide that
  //  section
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

  // Flexibly returns the truth value of the state variable (showS, showB, etc.)
  getState(stateVar) {
    var truth;
    if (stateVar === 'showS') {
      truth = this.state.showS
    } else if (stateVar === 'showB') {
      truth = this.state.showB
    } else if (stateVar === 'showR') {
      truth = this.state.showR
    } else if (stateVar === 'showT') {
      truth = this.state.showT
    }
    return truth
  }

  // Fed an item, it's index, and the category of the 'how to' content, the
  //  function renders and returns each individual entry
  renderEntry(item, i, type) {
    return (
      <View key={i}>
        <View style={styles.itemGroup}>
          <Text style={styles.toTextBright}>{item.text}</Text>
          <Text style={styles.toTextBright}>{'Day ' + item.day}</Text>
        </View>
        <Text style={styles.toText}>{item.description}</Text>
        {type === 'g' ? <Text>MAP</Text> : null}
        {type === 'vi' ? <Text>VIDEO</Text> : null}
        <Text></Text>
      </View>
    )
  }

  // Renders the Instructions toggle switch, and the corresponding information
  //  if the state indicates to show it; fed the 'showI' state variable
  renderInstructions(stateVar) {
    return (
      <View style={styles.groupContainer}>
        <TouchableOpacity
          onPress={() => this.setNewState(stateVar)}>
            {this.state.showI ?
              <Text style={styles.title}>Instructions:  &and;</Text> :
              <Text style={styles.title}>Instructions:  &or;</Text>
            }
        </TouchableOpacity>
        {this.state.showI ?
          <View>
            {instructions.map((item, i) => {
              // Alternate colors between bright blue and white
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
    )
  }

  // For each type of how to, this function renders and returns a toggle switch
  //  that, when turned on, displays the how to's for each category of content;
  //  the parameters are the type of toggle switch as it appears on the switch,
  //  the corresponding state variable, and the type of the toggle switch as it
  //  is stored in the database (difference between the first and third is that
  //  the third is not capitalized)
  renderGroup(type, stateVar, getVar) {
    var truth = this.getState(stateVar)
    return <View style={styles.groupContainer}>
      <TouchableOpacity
        onPress={() => this.setNewState(stateVar)}>
        <View style={styles.caretGroup}>
          <Text style={styles.title}>{type + ':  '}</Text>
          {truth ?
            <Text style={styles.title}>&and;</Text> :
            <Text style={styles.title}>&or;</Text>
          }
        </View>
      </TouchableOpacity>
      {truth ?
        <View>
          {/* Use the helper functions below to render each entry from each
                list of content */}
          <Text style={styles.label}>Vocabulary</Text>
          {this.getList(getVar, 'vocabulary').map((item, i) => {
            return this.renderEntry(item, i, 'vo')
          })}
          <Text style={styles.label}>Gear</Text>
          {this.getList(getVar, 'gear').map((item, i) => {
            return this.renderEntry(item, i, 'g')
          })}
          <Text style={styles.label}>Videos</Text>
          {this.getList(getVar, 'video').map((item, i) => {
            return this.renderEntry(item, i, 'vi')
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

          {/* View for displaying tutorials */}
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
  caretGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  itemGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
})
