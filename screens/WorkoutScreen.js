import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import Colors from '../constants/Colors';
import firebase from '../firebase';
var database = firebase.database();

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'MyWorkout',
  };

  findPath() {
    var user = firebase.auth().currentUser;

    var path = '';
    var pathArray = user.email.split('@')[0]
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

  componentDidMount() {
    var user = firebase.auth().currentUser;
    var path = this.findPath();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../tri.png')}
            style={styles.welcomeImage}
          />
        </View>
        <View style={styles.getStartedContainer}>
          <Text style={styles.titleText}>GO-TRI-GO</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.ourOrange,
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
