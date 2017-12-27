import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';import { ExpoLinksView } from '@expo/samples';
// import Select from 'react-select';

import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
// const defaultOption = options[0]
//
// const options = [{
//     value: 'date', label: "Date"
//   }, {
//     value: 'nutrition', label: "Tag: Nutrition"
//   }, {
//     value: 'prep', label: "Tag: Prep/Warmup"
//   }, {
//     value: 'challenge', label: "Tag: Challenge Level"
//   }, {
//     value: 'work', label: "Tag: What worked"
//   }, {
//     value: 'nowork', label: "Tag: What didn't work"
//   }, {
//     value: 'swim', label: "Tag: Swim"
//   }, {
//     value: 'bike', label: "Tag: Bike"
//   }, {
//     value: 'run', label: "Tag: Run"
//   }
// ]

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Journal',
    color: 'white'
  };

  constructor(props) {
    super(props)
    this.state = {
      dropwdown: 'date'
    }
    this._onSelect = this._onSelect.bind(this)
  }

  _onSelect() {

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
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Journal</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.dropdownTitle}>Sort Journals by:</Text>
            {/* <Select
              style={styles.dropdown}
              onChange={this._onSelect}
              value={this.state.dropdown}
              placeholder="Select a filter">
              {/* <option value="date">Date</option>
            </Select> */}
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
    width: 70,
    height: 26,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 5,
  },
  logoContainer: {
    width: screenWidth,
    marginLeft: 20,
  },
  strip: {
    flex: 1,
    height: 58,
    width: 500,
    backgroundColor: Colors.ourBlue,
    position: 'absolute',
    zIndex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
    borderWidth: 1,
    borderTopColor: 'white',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [
      {rotate: '-10deg'}
    ]
  },
  headerContainer: {
    marginTop: 4
  },
  headerText: {
    fontFamily: 'kalam-bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  contentContainer: {
    marginTop: 30,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ourBlue
  },
  dropDown: {

  },
  dropdownTitle: {
    fontFamily: 'kalam-bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});
