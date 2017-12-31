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


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "How To's",
    color: 'white'
  };

  constructor(props) {
    super(props)
    this.state = {
      tuts: [],
      showS: false,
      showBS: false,
      showB: false,
      showBR: false,
      showR: false
    }
    this.getList = this.getList.bind(this)
    this.setNewState = this.setNewState.bind(this)
    this.getTitle = this.getTitle.bind(this)
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

    return list
  }

  setNewState(newVar) {
    if (newVar === 'showS') {
      this.setState({
        showS: !this.state.showS
      })
    } else if (newVar === 'showSB') {
      this.setState({
        showSB: !this.state.showSB
      })
    } else if (newVar === 'showB') {
      this.setState({
        showB: !this.state.showB
      })
    } else if (newVar === 'showBR') {
      this.setState({
        showBR: !this.state.showBR
      })
    } else if (newVar === 'showR') {
      this.setState({
        showR: !this.state.showR
      })
    }
  }

  getTitle(newVar, type) {
    var title = ''
    if (newVar === 'showS') {
      this.state.showS ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    } else if (newVar === 'showSB') {
      this.state.showSB ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    } else if (newVar === 'showB') {
      this.state.showB ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    } else if (newVar === 'showBR') {
      this.state.showBR ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    } else if (newVar === 'showR') {
      this.state.showR ?
        title = <Text style={styles.title}>{type + ' '} &and;</Text> :
        title = <Text style={styles.title}>{type + ' '} &or;</Text>
    }
    return title
  }

  getState(stateVar) {
    var ourVar = ''
    if (stateVar === 'showS') {
      ourVar = this.state.showS
    } else if (stateVar === 'showSB') {
      ourVar = this.state.showSB
    } else if (stateVar === 'showB') {
      ourVar = this.state.showB
    } else if (stateVar === 'showBR') {
      ourVar = this.state.showBR
    } else if (stateVar === 'showR') {
      ourVar = this.state.showR
    }
    return ourVar
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
              <Text style={styles.toTextBright}>{'Day ' + item.day + ': ' + item.text}</Text>
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
            <Text style={styles.title}>How to use the app:</Text>
            <Text></Text>
            {this.renderGroup('Swim', 'showS', 'swim')}
            {this.renderGroup('Swim -> Bike', 'showSB', 'swim/bike')}
            {this.renderGroup('Bike', 'showB', 'bike')}
            {this.renderGroup('Bike -> Run', 'showBR', 'bike/run')}
            {this.renderGroup('Run', 'showR', 'run')}
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
    marginTop: 30,
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
