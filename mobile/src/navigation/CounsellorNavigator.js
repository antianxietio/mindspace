import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CounsellorDashboard from '../screens/counsellor/CounsellorDashboard';
import AvailabilityScreen from '../screens/counsellor/AvailabilityScreen';
import CounsellorAppointmentsScreen from '../screens/counsellor/CounsellorAppointmentsScreen';
import QRScannerScreen from '../screens/counsellor/QRScannerScreen';
import SessionDetailsScreen from '../screens/counsellor/SessionDetailsScreen';
import StudentHistoryScreen from '../screens/counsellor/StudentHistoryScreen';
import CounsellorProfileScreen from '../screens/counsellor/CounsellorProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Dashboard"
      component={CounsellorDashboard}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="QRScanner"
      component={QRScannerScreen}
      options={{ title: 'Scan QR Code' }}
    />
    <Stack.Screen
      name="SessionDetails"
      component={SessionDetailsScreen}
      options={{ title: 'Session Details' }}
    />
    <Stack.Screen
      name="StudentHistory"
      component={StudentHistoryScreen}
      options={{ title: 'Student History' }}
    />
  </Stack.Navigator>
);

const CounsellorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Availability':
              iconName = focused ? 'calendar-clock' : 'calendar-clock';
              break;
            case 'Appointments':
              iconName = focused ? 'calendar-check' : 'calendar-check-outline';
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
      <Tab.Screen name="Availability" component={AvailabilityScreen} />
      <Tab.Screen name="Appointments" component={CounsellorAppointmentsScreen} />
      <Tab.Screen name="Profile" component={CounsellorProfileScreen} />
    </Tab.Navigator>
  );
};

export default CounsellorNavigator;
