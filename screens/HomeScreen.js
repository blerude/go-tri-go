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

import { Dimensions } from 'react-native';

import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';

import Carousel from 'react-native-snap-carousel';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const images = [
  {image: require('../test1.jpeg'), text: '12 weeks to your first Sprint Tri'},
  {image: require('../test2.jpeg'), text: '12 week Personalized Training Plan'},
  {image: require('../test3.jpeg'), text: 'Get Fit, Confident, and RACE READY!'}
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
          <View style={styles.borderTop} >
          </View>
          <View style={styles.strip} >
          </View>
          <View>
            <Image
              source={require('../tri.png')}
              style={styles.logo}
            />
          </View>
          <View>
            <Text style={styles.titleText}>GO-TRI-GO</Text>
          </View>
          <Carousel
              renderItem={this._renderItem}
              data={images}
              sliderWidth={320}
              itemWidth={215}
              loop={true}
              activeSlideAlignment={'center'}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ourGrey,
    paddingTop: 10,
    alignItems: 'center'
  },
  logo: {
    width: 140,
    height: 52,
    resizeMode: 'contain',
    marginTop: 40,
    marginBottom: 5
  },
  titleText: {
    fontFamily: 'kalam-bold',
    fontSize: 44,
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  LoginRegisterTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 230,
    paddingBottom: 15
  },
  LoginRegisterText: {
    fontSize: 20,
    color: Colors.ourGreen,
    fontFamily: 'kalam-bold',
    textAlign: 'center',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  slideContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 215,
  },
  slideImage: {
    height: 284.44,
    width: 160,
  },
  slideText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
    marginTop: 14,
    backgroundColor: 'transparent'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: screenWidth+50,
    borderTopWidth: screenHeight+80,
    borderRightColor: '#5e5d5e',
    borderTopColor: 'transparent',
    position: 'absolute',
    zIndex: -2
  },
  borderTop: {
    flex: 1,
    height: screenHeight-50,
    width: screenWidth-30,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderTopColor: Colors.ourBlue,
    borderBottomColor: Colors.ourBlue,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderWidth: 1,
    borderRadius: 15,
    position: 'absolute',
    zIndex: -1
  },
  borderSide: {
    flex: 1,
    height: screenHeight-50,
    width: screenWidth-30,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'white',
    borderLeftColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    position: 'absolute',
    zIndex: -1
  },
  strip: {
    flex: 1,
    height: 375,
    width: 800,
    backgroundColor: '#5e5d5e',
    position: 'absolute',
    zIndex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 180,
    borderWidth: 1,
    borderColor: 'white',
    transform: [
      {rotate: '-10deg'}
    ]
  }
});
