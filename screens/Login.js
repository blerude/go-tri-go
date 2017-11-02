import React from 'react';
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
  }

  loginUser(){
    console.log('wooo logging in good job');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Login</Text>
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
          onPress={() => {this.registerNewUser()}}>
          <Text style={styles.registerButton}>Login</Text>
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
    width: 150,
    borderWidth: 2,
  }
});
