import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import StudentDashboard from '../screens/student/StudentDashboard';
import CounsellorListScreen from '../screens/student/CounsellorListScreen';
import BookAppointmentScreen from '../screens/student/BookAppointmentScreen';
import AppointmentsScreen from '../screens/student/AppointmentsScreen';
import JournalListScreen from '../screens/student/JournalListScreen';
import JournalEditorScreen from '../screens/student/JournalEditorScreen';
import MoodTrackerScreen from '../screens/student/MoodTrackerScreen';
import SessionHistoryScreen from '../screens/student/SessionHistoryScreen';
import QRCodeScreen from '../screens/student/QRCodeScreen';
import ProfileScreen from '../screens/student/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Dashboard"
      component={StudentDashboard}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CounsellorList"
      component={CounsellorListScreen}
      options={{ title: 'Counsellors' }}
    />
    <Stack.Screen
      name="BookAppointment"
      component={BookAppointmentScreen}
      options={{ title: 'Book Appointment' }}
    />
    <Stack.Screen
      name="QRCode"
      component={QRCodeScreen}
      options={{ title: 'My QR Code' }}
    />
  </Stack.Navigator>
);

const JournalStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="JournalList"
      component={JournalListScreen}
      options={{ title: 'My Journals' }}
    />
    <Stack.Screen
      name="JournalEditor"
      component={JournalEditorScreen}
      options={{ title: 'Write Journal' }}
    />
  </Stack.Navigator>
);

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Appointments':
              iconName = focused ? 'calendar-check' : 'calendar-check-outline';
              break;
            case 'Journal':
              iconName = focused ? 'book-open' : 'book-open-outline';
              break;
            case 'Mood':
              iconName = focused ? 'emoticon-happy' : 'emoticon-happy-outline';
              break;
            case 'History':
              iconName = focused ? 'history' : 'history';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Journal" component={JournalStack} />
      <Tab.Screen name="Mood" component={MoodTrackerScreen} />
      <Tab.Screen name="History" component={SessionHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
