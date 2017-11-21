import React from 'react';
import Login from './Login';

import { Dimensions, ScrollView, Image, Platform, StyleSheet, View, Text, Button, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    color: 'white'
  };

  constructor(props) {
    super(props)
    this.state = {
      email: '',
     }

     this.findPath = this.findPath.bind(this)
     this.changeEmail = this.changeEmail.bind(this);
     this.changePassword = this.changePassword.bind(this)
     this.signOut = this.signOut.bind(this)
  }

  findPath(email) {
    var user = firebase.auth().currentUser;

    var path = '';
    var pathArray = email.split('@')[0]
    pathArray.split('').forEach(letter => {
      if (letter != '.') {
        path = path + letter
      } else {
        path = path + '@'
      }
    })
    console.log('path: ' + path)
    return path
  }

  changeEmail() {
    var user = firebase.auth().currentUser;
    var newEmail = this.state.email

    user.updateEmail(newEmail).then(function() {
      console.log('New email verification sent.')
      var updates = {}
      updates['/users/' + user.uid + '/email'] = newEmail
      firebase.database().ref().update(updates)
      .catch(error => {
        console.log('Error Updating: ' + error.message)
      })
    }).catch(function(error) {
      console.log('Error updating email: ' + error.message)
      alert(error.message)
    });
  }

  changePassword() {
    var auth = firebase.auth();
    var user = auth.currentUser;
    var nav = this.props.navigation

    auth.sendPasswordResetEmail(user.email).then(function() {
      console.log('Password change email sent.')
      alert("Check your account's email to reset your password!")
      nav.navigate('Login');
    }).catch(function(error) {
      console.log('Error sending password reset email: ' + error.message)
      alert("Error sending password reset email: " + error.message)
    });
  }

  signOut() {
    var auth = firebase.auth();
    var user = auth.currentUser;
    var nav = this.props.navigation

    auth.signOut().then(result => {
      console.log('Successfully signed out', result)
      nav.navigate('Login');
    })
    .catch(error => {
      console.log('Error signing out: ' + error.message)
    })
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.headerText}>Account Settings</Text>
          <Text style={styles.sloganText}>Need to change your account info?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="New Email"
            onChangeText={(text) => this.setState({email: text})}
          />
          <TouchableOpacity
            onPress={() => {this.changeEmail()}}>
            <Text style={styles.registerButton}>Change Email Address</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {this.changePassword()}}>
            <Text style={styles.registerButton}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {this.signOut()}}>
            <Text style={styles.smallText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
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
    marginTop: 20,
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
    fontSize: 15,
    color: 'white',
    lineHeight: 18,
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
    marginBottom: 35,
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
    height: 375,
    width: 450,
    backgroundColor: Colors.ourBackgroundGrey,
    position: 'absolute',
    zIndex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 160,
    borderWidth: 1,
    borderTopColor: 'white',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [
      {rotate: '-10deg'}
    ]
  }
});
