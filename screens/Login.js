import React from 'react';
import Registration from './Registration';

import { ScrollView, Image, Platform, StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';

export default class Login extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
     }

     this.loginUser = this.loginUser.bind(this);
     this.needToRegister = this.needToRegister.bind(this);
  }

  loginUser(){
    console.log('wooo logging in good job');
    this.props.navigation.navigate('MainTabNavigator');
  }

  needToRegister(){
    this.props.navigation.navigate('Registration');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../tri.png')}
            style={styles.welcomeImage}
          />
        </View>
        <View style={styles.getStartedContainer}>
          <Text style={styles.titleText}>GO-TRI-GO</Text>
        </View>
        <Text style={styles.subtitleText}>
          Your customizable training plan for your first triathlon.
        </Text>
        <Text style={styles.headerText}>Log In</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity
          onPress={() => {this.loginUser()}}>
          <Text style={styles.registerButton}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {this.needToRegister()}}>
          <Text style={styles.smallText}>Need to register?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  textInput: {
    height: 40,
    borderWidth: 2,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5
  },
  registerButton: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    width: 150,
    borderWidth: 2,
  },
  smallText: {
    marginTop: 15,
    marginLeft: 5,
    color: 'grey'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 140,
    height: 120,
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
    fontSize: 44,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 56,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'kalam-bold',
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  }
});
