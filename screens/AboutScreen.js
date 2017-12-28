import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import Colors from '../constants/Colors';
import { Dimensions } from 'react-native';

import Carousel, { Pagination }  from 'react-native-snap-carousel';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const testimonials = [
  {text: 'I could barely swim 50 yards in the pool at the beginning of my training process and felt that my swim ended up to be the strongest event on race day!', author: 'Go-Tri-Go user'},
  {text: 'This training plan was easy to follow, and I was able to modify it to my busy work schedule.', author: 'Beginner triathlete'},
  {text: 'I would have never successfully reached the finish line on race day without the Go-Tri-Go program. I would recommend this invaluable program without hesitation.', author: 'Newly confident triathlete'},
]

const intro = "Go-Tri-Go is an adaptable triathlon training plan meant to get you ready for your first sprint triathlon. You have the power to personalize the program towards your strengths so that you feel confident on race day!"


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  };

  constructor(props) {
    super(props)
    this.state = {
      activeSlide: 0
    }

     this._renderItem = this._renderItem.bind(this);
     this._onScroll = this._onScroll.bind(this);
  }

  _renderItem ({item, index}) {
    return (
      <View style={styles.slideContainer}>
        <Text style={styles.slideText}>{item.text}</Text>
        <Text style={styles.slideAuthor}>{item.author}</Text>
      </View>
    );
  }

  _onScroll(index){
    console.log('CURRENT INDEX: ', index)
    this.setState({activeSlide: index})
  }

  get pagination () {
       const activeSlide = this.state.activeSlide;
       return (
           <Pagination style={styles.pagination}
             dotsLength={testimonials.length}
             activeDotIndex={activeSlide}
           />
       );
   }

  render() {
    return (

      <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.strip} >
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../tri.png')}
            style={styles.logo}
          />
        </View>
        <View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentHeaderText}>About GO-TRI-GO</Text>
          <Text style={styles.aboutTheAppText}>{intro}</Text>
          <Text style={styles.contentHeader2Text}>Testimonials</Text>
          <Carousel
              renderItem={this._renderItem}
              data={testimonials}
              sliderWidth={320}
              itemWidth={215}
              loop={true}
              activeSlideAlignment={'center'}
              onSnapToItem={this._onScroll}
          />
          { this.pagination }
        </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: Colors.ourGrey
  },
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
    marginTop: 10,
    marginBottom: 5,
  },
  logoContainer: {
    width: screenWidth,
    marginLeft: 20,
  },
  titleText: {
    fontFamily: 'kalam-bold',
    fontSize: 44,
    color: Colors.ourBlue,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  contentContainer: {
    marginTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    height: 440
    },
  contentHeaderText: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  contentHeader2Text: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginTop: 20
  },
  aboutTheAppText: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 17
  },
  strip: {
    flex: 1,
    height: 460,
    width: 500,
    backgroundColor: Colors.ourOrange,
    position: 'absolute',
    zIndex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
    borderWidth: 1,
    borderTopColor: 'white',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [
      {rotate: '-10deg'}
    ]
  },
  slideContainer: {
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 215
  },
  slideAuthor: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
    fontStyle: 'italic',
    marginTop: 10,
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  },
  slideText: {
    textAlign: 'justify',
    fontSize: 15,
    color: 'white',
    fontStyle: 'italic',
    backgroundColor: 'transparent'
  },
  pagination: {
    marginTop: 5
  }
});
