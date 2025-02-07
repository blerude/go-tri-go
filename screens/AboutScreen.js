import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import Carousel, { Pagination }  from 'react-native-snap-carousel';
import { ExpoLinksView } from '@expo/samples';

import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Used in the carousel
const testimonials = [
  {text: "I could barely swim 50 yards in the pool at the beginning of my training process and felt that my swim ended up to be the strongest event on race day!", author: 'Tiffany Barnett'},
  {text: "I am an active but heavier female. The adaptability of the program helped me to build on each aspect of my baseline strengths and turn my perceived weaknesses into measurable training opportunities.", author: 'Lillian Morton'},
  {text: "I would have never successfully reached the finish line on race day without the GO-TRI-GO program. I would recommend this invaluable program without hesitation.", author: 'GO-TRI-GO user'},
  {text: "GO-TRI- GO was a great program and helped me achieve my goal. Without it I am certain I would not have been able to finish, or maybe even start, the race.", author: 'Cheryl Olson'},
  {text: "This program helped me to tailor my training to my specific skill level in the various disciplines, which kept me motivated and engaged. I was able to build up my confidence in my weak areas!", author: 'Beginner Triathlete'},
  {text: "The training plan really helped me progress towards my goal of completing my first triathlon. Come race day, I was confient and knew what to expect. I couldn't have done it without GO-TRI-GO!", author: 'Troy Hill'}
]

const slogan = "Plan your work and work your plan!"
const intro = "GO-TRI-GO is a comprehensive 12 week Sprint Triathlon training program that will get you fit, confident, and race ready! You choose the level of difficulty, and we'll give you the 'how-tos' so you can get it done!"


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  }

  constructor(props) {
    super(props)
    this.state = {
      activeSlide: 0  // which carousel slide is being viewed
    }

    this._renderItem = this._renderItem.bind(this)
    this._onScroll = this._onScroll.bind(this)
  }

  // Renders each slide of the carousel
  _renderItem ({item, index}) {
    return (
      <View style={styles.slideContainer}>
        <Text style={styles.slideText}>{item.text}</Text>
        <Text style={styles.slideAuthor}>{item.author}</Text>
      </View>
    )
  }

  // Allows carousel to be scrolled through, changing the state to mirror
  //  which slide is being viewed
  _onScroll(index){
    this.setState({activeSlide: index})
  }

  // Controls the appearance of the dots indicating which slide of the carousel
  //  is being viewed
  get pagination () {
    const activeSlide = this.state.activeSlide
    return (
      <Pagination style={styles.pagination}
        dotsLength={testimonials.length}
        activeDotIndex={activeSlide}
      />
    )
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
            <Text style={styles.sloganText}>{slogan}</Text>
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
    )
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
  contentContainer: {
    marginTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    height: 460
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
    marginTop: 5
  },
  sloganText: {
    fontFamily: 'kalam-bold',
    fontSize: 20,
    color: Colors.ourBackgroundGrey,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  aboutTheAppText: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 15
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
    marginTop: 5,
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
  }
})
