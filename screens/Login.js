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

import Registration from './Registration';

import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const slogan = "Plan your work and work your plan!";


export default class Login extends React.Component {
  static navigationOptions = {
    title: 'Login',
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }

    this.loginUser = this.loginUser.bind(this)
    this.needToRegister = this.needToRegister.bind(this)
  }

  // Initiates the Firebase authentication process of logging a user in while
  //  setting the persistence to a local status; navigates into the main app
  loginUser() {
    var nav = this.props.navigation
    var email = this.state.email
    var password = this.state.password

    // New sign-in will be persisted with local persistence.
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(result => {
      return firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        nav.navigate('MainTabNavigator')
      }).catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message
        console.log('Error signing in: ' + errorMessage)
        alert('Error signing in: ' + errorMessage)
      })
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message
      console.log('Error setting up local persistence: ' + errorMessage)
    })
  }

  // Initiates the Firebase method of sending a password reset email and alerts
  //  the user that an email has been sent to their registered email
  forgotPassword() {
    var auth = firebase.auth()
    var emailAddress = this.state.email
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      console.log('Password reset email sent.')
      alert('Check your email to reset your password.')
    }).catch(function(error) {
      console.log('Error sending password reset email: ' + error.message)
      alert('Please enter a valid email address through which can reset your password.')
    })
  }

  // Redirects to the Registration page
  needToRegister() {
    this.props.navigation.navigate('Registration')
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

          <View style={styles.loginContainer}>
            <Text style={styles.headerText}>Log In</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              onChangeText={(text) => this.setState({email: text})}
            />
            <TextInput
              secureTextEntry={true}
              style={styles.textInput}
              placeholder="Password"
              onChangeText={(text) => this.setState({password: text})}
            />
            <TouchableOpacity
              onPress={() => {this.loginUser()}}>
              <Text style={styles.registerButton}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {this.forgotPassword()}}>
              <Text style={styles.smallText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {this.needToRegister()}}>
              <Text style={styles.smallText}>Need to register?</Text>
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
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  sloganText: {
    fontFamily: 'kalam-bold',
    fontSize: 18,
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  loginContainer: {
    marginTop: 50
  },
  headerText: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
    color: 'white'
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
  smallText: {
    marginTop: 10,
    marginLeft: 5,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontStyle: 'italic',
  },
  borderTop: {
    flex: 1,
    height: screenHeight-120,
    width: screenWidth-30,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderTopColor: Colors.ourBlue,
    borderBottomColor: Colors.ourBlue,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderWidth: 1,
    borderRadius: 15,
    position: 'absolute',
    zIndex: -1
  },
  strip: {
    flex: 1,
    height: 270,
    width: 450,
    backgroundColor: Colors.ourBlue,
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
