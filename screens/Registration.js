import React from 'react';
import Login from './Login';
import { ScrollView, StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';

export default class Registration extends React.Component {
  static navigationOptions = {
    title: 'Registration',
  };

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
     }

     this.registerNewUser = this.registerNewUser.bind(this);
  }

  registerNewUser(){
    console.log('wooo registering good job');
    // axios({
    //   method: 'post',
    //   url: '/registerUser',
    //   data: {
    //     username: this.state.username,
    //     password: this.state.password
    //   }
    // })
    // .then((resp) => {
    //   console.log('new user data sent');
    // })
    // .catch(err => {
    //     console.log('error sending new user data');
    // })
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Register</Text>
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
          <Text style={styles.registerButton}>Register</Text>
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
  }
});
