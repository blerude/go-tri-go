import React from 'react';
import Login from './Login';
import { ScrollView, Image, Platform, StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';
import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

export default class Registration extends React.Component {
  static navigationOptions = {
    title: 'Registration',
  };

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

     this.registerNewUser = this.registerNewUser.bind(this);
  }

  registerNewUser() {
    console.log('Wooo registering user!');
    var nav = this.props.navigation

    var path = '';
    var pathArray = this.state.email.split('@')[0]
    pathArray.split('').forEach(letter => {
      if (letter != '.') {
        path = path + letter
      } else {
        path = path + '@'
      }
    })

    firebase.auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        console.log('User created: ' + user.uid)
        database.ref('users/' + path).set({
          first: this.state.first,
          last: this.state.last,
          city: this.state.city,
          state: this.state.state,
          email: this.state.email
        })
        .then(user => {
          console.log('User saved to database!')
          var user = firebase.auth().currentUser;
          user.sendEmailVerification().then(function() {
            nav.navigate('Login');
          }).catch(function(error) {
            console.log('Error sending validation email: ' + error.message)
          });
        })
        .catch(err => {
          console.log('Error saving user to database: ' + err)
        })
      })
      .catch(function(error) {
          // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error creating user: ' + errorMessage)
      });
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
        <View style={styles.registerContainer}>
          <Text style={styles.headerText}>Register</Text>
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            onChangeText={(text) => this.setState({first: text})}
            required
          />
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            onChangeText={(text) => this.setState({last: text})}
            required
          />
          <TextInput
            style={styles.textInput}
            placeholder="City"
            onChangeText={(text) => this.setState({city: text})}
            required
          />
          <TextInput
            style={styles.textInput}
            placeholder="State"
            onChangeText={(text) => this.setState({state: text})}
            required
          />
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
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
  registerContainer: {

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
  }
});
