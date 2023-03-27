import {createStackNavigator} from '@react-navigation/stack';

import AttendanceList from '../Screens/AttendanceList';
import GenerateQr from '../Screens/GenerateQr';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="GenerateQR"
        component={GenerateQr}
        options={{
          headerTitle: 'Generate QR Code',
        }}
      />

      <Stack.Screen
        name="AttendanceList"
        component={AttendanceList}
        options={{
          headerTitle: 'Attendance List',
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default MyStack;
