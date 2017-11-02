import React from 'react';
import Registration from './Registration';

import { ScrollView, StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';

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
  }
});
