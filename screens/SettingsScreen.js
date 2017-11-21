import React from 'react';
import { ExpoConfigView } from '@expo/samples';

import Colors from '../constants/Colors';
import firebase from '../firebase';
import { Dimensions } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    color: 'white'
  };

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
    var oldEmail = user.email
    var newEmail = "user@example.com"
    user.updateEmail(newEmail).then(function() {
      user.sendEmailVerification(newEmail).then(function() {
        console.log('New email verification sent.')

        var newPath = findPath(newEmail)
        var oldPath = findPath(oldEmail)
        var oldAccount = firebase.database().ref('users/' + oldPath)
        database.ref('users/' + newPath).set({
          first: oldAccount.first,
          last: oldAccount.last,
          city: oldAccount.city,
          state: oldAccount.state,
          email: newEmail
        })
        .catch(error => {
          console.log('Error setting new path: ' + error.message)
        })

        database.ref('users/' + oldPath).remove().then(result => {
          console.log('Old path removed.')
        })
        .catch(error =>  {
          console.log('Error removing old path: ' + error.message)
        })
      }).catch(function(error) {
        console.log('Error sending new email verification: ' + error.message)
        alert('Please enter a valid email address through which can reset your password.')
      });
    }).catch(function(error) {
      console.log('Error updating email: ' + error.message)
    });
  }

  changePassword() {
    var auth = firebase.auth();
    var user = auth.currentUser();
    auth.sendPasswordResetEmail(user.email).then(function() {
      console.log('Password change email sent.')
    }).catch(function(error) {
      console.log('Error sending password reset email: ' + error.message)
    });
  }

  signOut() {
    var auth = firebase.auth();
    auth.getInstance().signOut()
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <ExpoConfigView />;
  }
}
