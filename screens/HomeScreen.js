import React from 'react';

import Registration from './Registration';
import Login from './Login';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';

import Carousel from 'react-native-snap-carousel';

const images = [
  {image: require('../test1.jpeg'), text: 'Image 1 description'},
  {image: require('../test2.jpeg'), text: 'Image 2 description'},
  {image: require('../test3.jpeg'), text: 'Image 3 description'}
]

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

     this.goToLogin = this.goToLogin.bind(this);
     this.goToRegistration = this.goToRegistration.bind(this);
     this._renderItem = this._renderItem.bind(this);

  }

  goToLogin(e) {
    this.props.navigation.navigate('Login');
  }

  goToRegistration(e) {
    this.props.navigation.navigate('Registration');
  }

  _renderItem ({item, index}) {
    return (
      <View style={styles.slideContainer}>
        <Image
          source={item.image}
          style={styles.slideImage}
        />
        <Text style={styles.slideText}>{item.text}</Text>
      </View>
    );
}

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../tri.png')}
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.titleText}>GO-TRI-GO</Text>
          </View>

          <Carousel
              renderItem={this._renderItem}
              data={images}
              sliderWidth={250}
              itemWidth={160}
            />

          <View style={styles.LoginRegisterTextContainer}>
            <TouchableOpacity
              onPress={() => {this.goToLogin()}}>
              <Text style={styles.LoginRegisterText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {this.goToRegistration()}}>
              <Text style={styles.LoginRegisterText}>Register</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* <View style={styles.tabBarInfoContainer}> */}

          {/* <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View> */}
        {/* </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ourGrey,
  },
  contentContainer: {
    paddingTop: 20,
    alignItems: 'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  welcomeImage: {
    width: 140,
    height: 120,
    resizeMode: 'contain',
    marginTop: 0,
    marginLeft: -10,
  },
  titleText: {
    fontFamily: 'kalam-bold',
    fontSize: 44,
    color: Colors.ourBlue,
    lineHeight: 56,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'kalam-bold',
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  LoginRegisterTextContainer: {
    marginTop: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280
  },
  LoginRegisterText: {
    fontSize: 30,
    color: Colors.ourGreen,
    textAlign: 'center',
    flex: 1,
    alignItems: 'center'
  },
  slideContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  slideImage: {
    height: 284.44,
    width: 160
  },
  slideText: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.ourOrange,
    marginTop: 14
  }
});
