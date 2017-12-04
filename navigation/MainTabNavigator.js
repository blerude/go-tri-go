import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import WorkoutScreen from '../screens/WorkoutScreen';
import TrainingPlanScreen from '../screens/TrainingPlanScreen';
import JournalScreen from '../screens/JournalScreen';
import TutorialsScreen from '../screens/TutorialsScreen';
import AboutScreen from '../screens/AboutScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    About: {
      screen: AboutScreen,
    },
    MyWorkout: {
      screen: WorkoutScreen,
    },
    TrainingPlan: {
      screen: TrainingPlanScreen,
    },
    Tutorials: {
      screen: TutorialsScreen,
    },
    Journal: {
      screen: JournalScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'About':
            iconName = Platform.OS === 'ios' ? `ios-home${focused ? '' : '-outline'}` : 'md-home';
            break;
          case 'MyWorkout':
            iconName = Platform.OS === 'ios' ? `ios-pulse${focused ? '' : '-outline'}` : 'md-pulse';
            break;
          case 'TrainingPlan':
            iconName = Platform.OS === 'ios' ? `ios-trending-up${focused ? '' : '-outline'}` : 'md-trending-up';
            break;
          case 'Tutorials':
            iconName = Platform.OS === 'ios' ? `ios-albums${focused ? '' : '-outline'}` : 'md-albums';
            break;
          case 'Journal':
            iconName = Platform.OS === 'ios' ? `ios-create${focused ? '' : '-outline'}` : 'md-create';
            break;
          case 'Settings':
            iconName =
              Platform.OS === 'ios' ? `ios-settings${focused ? '' : '-outline'}` : 'md-settings';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.ourGrey : 'white'}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      inactiveTintColor: 'white',
      activeBackgroundColor: 'white',
      inactiveBackgroundColor: Colors.ourGrey,
    },
    initialRouteName: 'MyWorkout'
  }
);
