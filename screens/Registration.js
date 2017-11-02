import React from 'react';
import Login from './Login';
import { ScrollView, Image, Platform, StyleSheet, View, Text, Button, TouchableOpacity, TextInput } from 'react-native';

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
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../tri.png')}
            style={styles.welcomeImage}
          />
        </View>
        <View style={styles.getStartedContainer}>
          <Text style={styles.titleText}>GO-TRI-GO</Text>
        </View>
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
  }
});
