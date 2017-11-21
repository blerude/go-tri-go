import React from 'react';
import Registration from './Registration';

import { ScrollView, Image, Platform, StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

export default class Login extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
     }

     this.loginUser = this.loginUser.bind(this);
     this.needToRegister = this.needToRegister.bind(this);
  }

  loginUser() {
    console.log('Wooo logging in!');
    var nav = this.props.navigation
    firebase.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        console.log('Signed in: ' + user.uid)
        nav.navigate('MainTabNavigator');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error signing in: ' + errorMessage)
      });
  }

  forgotPassword() {
    var auth = firebase.auth();
    var emailAddress = this.state.email;
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      console.log('Password reset email sent.')
    }).catch(function(error) {
      console.log('Error sending password reset email: ' + error.message)
    });
  }

  needToRegister() {
    this.props.navigation.navigate('Registration');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../tri.png')}
            style={styles.logo}
          />
          <Text style={styles.titleText}>GO-TRI-GO</Text>
          <Text style={styles.subtitleText}>
            Your customizable training plan for your first triathlon.
          </Text>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    // backgroundColor: '#fff',
    backgroundColor: Colors.ourBlue,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  titleText: {
    fontFamily: 'kalam-bold',
    fontSize: 32,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 44,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'kalam-bold',
    fontSize: 15,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 18,
    textAlign: 'center',
  },
  loginContainer: {

  },
  headerText: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
  },
  textInput: {
    fontFamily: 'kalam-bold',
    height: 25,
    width: 300,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5
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
    height: 25,
    borderWidth: 2,
    borderRadius: 5
  },
  smallText: {
    fontFamily: 'kalam-bold',
    marginTop: 15,
    marginLeft: 5,
    textAlign: 'center',
    color: 'grey'
  }
});
