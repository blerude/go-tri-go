import React from 'react';
import Login from './Login';
import { ScrollView, Image, Platform, StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';
import Colors from '../constants/Colors';
// import firebase from '../firebase';
// var database = firebase.database();
var userId = 1;

export default class Registration extends React.Component {
  static navigationOptions = {
    title: 'Registration',
  };

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
     }

     this.registerNewUser = this.registerNewUser.bind(this);
  }

  registerNewUser(e) {
    e.preventDefault();
    console.log('wooo registering good job');
    database.ref('users/' + userId).set({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    });
    userId++;
    this.props.navigation.navigate('Login');
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
            placeholder="Username"
            onChangeText={(text) => this.setState({username: text})}
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
