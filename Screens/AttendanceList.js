import {
  Box,
  Button,
  Center,
  Divider,
  FlatList,
  HStack,
  ScrollView,
  Spacer,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useEffect, useState} from 'react';
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {auth, db} from '../firebase-config';
import {SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLottieView from 'lottie-react-native';
import assets from '../assets';

const AttendanceList = () => {
  const [date, setDate] = useState(new Date());
  const [collegeName, setCollegeName] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(false);
  const [initialState, setInitialState] = useState(true);

  const compareDate = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    date1.toUTCString();
    date2.toUTCString();
    if (
      date1.getUTCDate() === date2.getUTCDate() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCFullYear() === date2.getUTCFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  };
  const onChange = async (event, selectedDate) => {
    setSelectedDate(selectedDate);
    const currentDate = selectedDate;
    setDate(currentDate);
    await AsyncStorage.getItem('UID')
      .then(uid => {
        const q = query(
          collection(db, 'collegeAdmins'),
          where('uid', '==', uid),
        );
        onSnapshot(q, snapshot => {
          snapshot.docs.forEach(doc => {
            const data = doc.data().collegeName;
            setCollegeName(data);
          });
        });
      })
      .catch(error => console.log(error));
  };

  const fetchAttendance = async () => {
    setAttendanceData([]);
    setLoading(true);
    const q = query(
      collection(db, 'attendance'),
      where('collegeName', '==', collegeName),
      orderBy('time', 'asc'),
    );
    const snapshot = await getDocs(q);
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (compareDate(data.date, date)) {
        setAttendanceData(prev => [...prev, data]);
      }
    });
    setInitialState(false);
    setLoading(false);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: 'date',
      is24Hour: true,
    });
  };
  return (
    <Center width={'100%'}>
      <Button onPress={showDatePicker} width={'90%'} marginTop={3}>
        <Text style={{color: 'white'}}>
          {selectedDate ? selectedDate.toDateString() : 'Select a Date'}
        </Text>
      </Button>
      <Button
        onPress={fetchAttendance}
        width={'90%'}
        marginTop={3}
        isLoading={loading}
        isLoadingText="Fetching Data">
        <Text style={{color: 'white'}}>Fetch Data</Text>
      </Button>

      <>
        {attendanceData.length > 0 ? (
          <>
            <HStack
              width={'90%'}
              justifyContent={'space-between'}
              marginTop={3}
              marginBottom={3}>
              <Text width={'15%'} fontWeight={'bold'}>
                S.No
              </Text>
              <Text width={'25%'} fontWeight={'bold'}>
                Name
              </Text>
              <Text width={'25%'} fontWeight={'bold'}>
                Enrollment No.
              </Text>
              <Text width={'25%'} fontWeight={'bold'}>
                In Time
              </Text>
            </HStack>
            <Divider thickness={2} bg={'black'} width={'90%'} />
            <FlatList
              data={attendanceData}
              initialNumToRender={15}
              style={{
                width: '90%',
                height: '75%',
              }}
              renderItem={({item, index}) => {
                return (
                  <HStack
                    key={index}
                    justifyContent={'space-between'}
                    marginTop={3}>
                    <Text width={'15%'}>{index + 1}.</Text>
                    <Text width={'25%'}>{item?.name}</Text>
                    <Text width={'25%'}>{item?.enrollmentno}</Text>
                    <Text width={'25%'}>{item?.time}</Text>
                  </HStack>
                );
              }}></FlatList>
          </>
        ) : (
          <>
            {loading ? (
              <>
                <AnimatedLottieView
                  style={{width: '100%', mt: 50}}
                  source={assets.lottieFiles.loading}
                  autoPlay
                  loop
                />
              </>
            ) : (
              <>
                {initialState ? (
                  <>
                    <AnimatedLottieView
                      style={{width: '100%', marginTop: 50}}
                      source={assets.lottieFiles.search}
                      autoPlay
                      loop
                    />
                  </>
                ) : (
                  <AnimatedLottieView
                    style={{width: '100%', marginTop: 50}}
                    source={assets.lottieFiles.empty}
                    autoPlay
                    loop
                  />
                )}
              </>
            )}
          </>
        )}
      </>
    </Center>
  );
};
export default AttendanceList;
