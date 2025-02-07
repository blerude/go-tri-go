import React from 'react';
import {
  Dimensions,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import firebase from '../firebase';
var database = firebase.database();

import Login from './Login';

import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const slogan = "Plan your work and work your plan!";


export default class Registration extends React.Component {
  static navigationOptions = {
    title: 'Registration',
  }

  constructor(props) {
    super(props)
    this.state = {
      first: '',
      last: '',
      city: '',
      state: '',
      email: '',
      password: '',
    }

    this.registerNewUser = this.registerNewUser.bind(this)
  }

  // Initiates the Firebase authentication process of creating a user; saves the
  //  user information in the database as well; navigates to the Login screen
  registerNewUser() {
    var nav = this.props.navigation
    firebase.auth()
    .createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(user => {
      database.ref('users/' + user.uid).set({
        first: this.state.first,
        last: this.state.last,
        city: this.state.city,
        state: this.state.state,
        email: this.state.email,
        day: 1,
        selectedWorkouts: []
      })
      .then(user => {
        var user = firebase.auth().currentUser
        user.sendEmailVerification().then(function() {
          nav.navigate('Login');
        }).catch(function(error) {
          // Handle Errors here.
          console.log('Error sending validation email: ' + error.message)
        })
      })
      .catch(err => {
        // Handle Errors here.
        console.log('Error saving user to database: ' + err)
      })
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message
      console.log('Error creating user: ' + errorMessage)
      alert('Error creating user: ' + errorMessage)
    })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.borderTop} >
          </View>
          <View style={styles.strip} >
          </View>
          <View>
            <Image
              source={require('../tri.png')}
              style={styles.logo}
            />
          </View>
          <View>
            <Text style={styles.titleText}>GO-TRI-GO</Text>
            <Text style={styles.sloganText}>{slogan}</Text>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.headerText}>Register</Text>
            <View style={styles.textGroup}>
              <TextInput
                style={styles.textInputDuo}
                placeholder="First Name"
                onChangeText={(text) => this.setState({first: text})}
                required
              />
              <TextInput
                style={styles.textInputDuo}
                placeholder="Last Name"
                onChangeText={(text) => this.setState({last: text})}
                required
              />
            </View>
            <View style={styles.textGroup}>
              <TextInput
                style={styles.textInputDuo}
                placeholder="City"
                onChangeText={(text) => this.setState({city: text})}
                required
              />
              <TextInput
                style={styles.textInputDuo}
                placeholder="State/Country"
                onChangeText={(text) => this.setState({state: text})}
                required
              />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              onChangeText={(text) => this.setState({email: text})}
              required
            />
            <TextInput
              secureTextEntry={true}
              style={styles.textInput}
              placeholder="Password"
              onChangeText={(text) => this.setState({password: text})}
              required
            />
            <TouchableOpacity
              onPress={() => {this.registerNewUser()}}>
              <Text style={styles.registerButton}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ourGrey,
    alignItems: 'center'
  },
  textGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 140,
    height: 52,
    resizeMode: 'contain',
    marginTop: 40,
    marginBottom: 5
  },
  titleText: {
    fontFamily: 'kalam-bold',
    fontSize: 44,
    color: Colors.ourGreen,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  registerContainer: {
    marginTop: 45
  },
  headerText: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
    color: 'white'
  },
  sloganText: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    color: Colors.ourGreen,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  textInput: {
    fontFamily: 'kalam-bold',
    height: 35,
    width: 300,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    borderColor: 'white',
    color: 'white'
  },
  textInputDuo: {
    fontFamily: 'kalam-bold',
    height: 35,
    width: 145,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    borderColor: 'white',
    color: 'white'
  },
  registerButton: {
    fontFamily: 'kalam-bold',
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    width: 150,
    height: 30,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'transparent',
    color: 'white',
    borderColor: 'white'
  },
  borderTop: {
    flex: 1,
    height: screenHeight-120,
    width: screenWidth-30,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderTopColor: Colors.ourGreen,
    borderBottomColor: Colors.ourGreen,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderWidth: 1,
    borderRadius: 15,
    position: 'absolute',
    zIndex: -1
  },
  strip: {
    flex: 1,
    height: 290,
    width: 450,
    backgroundColor: Colors.ourGreen,
    position: 'absolute',
    zIndex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 235,
    borderWidth: 1,
    borderTopColor: 'white',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [
      {rotate: '-10deg'}
    ]
  }
})
