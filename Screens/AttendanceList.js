import {Button, Center, HStack, Text} from 'native-base';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useState} from 'react';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {auth, db} from '../firebase-config';

const AttendanceList = () => {
  const [date, setDate] = useState(new Date());
  const [collegeName, setCollegeName] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    console.log(currentDate.toUTCString());
    const uid = auth?.currentUser.uid;
    const q = query(collection(db, 'collegeAdmins'), where('uid', '==', uid));
    onSnapshot(q, snapshot => {
      snapshot.docs.forEach(doc => {
        const data = doc.data().collegeName;
        setCollegeName(data);
      });
    });

    const q2 = query(
      collection(db, 'attendance'),
      where('collegeName', '==', collegeName),
    );
    onSnapshot(q2, snapshot => {
      snapshot.docs.forEach(doc => {
        if (doc.data().date === currentDate.toUTCString()) {
          console.log('matched');
        }
        const data = doc.data();
        console.log(data);
      });
    });
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
        <Text style={{color: 'white'}}>Pick a Date</Text>
      </Button>
    </Center>
  );
};
export default AttendanceList;
