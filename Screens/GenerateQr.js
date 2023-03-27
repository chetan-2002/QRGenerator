import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {
  Box,
  Button,
  Center,
  IconButton,
  Spinner,
  Text,
  WarningOutlineIcon,
} from 'native-base';
import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFetchBlob from 'rn-fetch-blob';
import {auth, db} from '../firebase-config';
import Share from 'react-native-share';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenerateQr = ({navigation}) => {
  const [collegeName, setCollegeName] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [QrImage, setQrImage] = useState(null);
  const [QrImageData, setQrImageData] = useState(null);

  const removeItem = async () => {
    await AsyncStorage.removeItem('UID')
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(error => console.log(error));
  };

  navigation.setOptions({
    headerRight: () => {
      return (
        <>
          <IconButton
            onPress={() => {
              removeItem();
              // navigation.navigate('Login');
            }}
            icon={
              <MaterialIcons name="logout" size={25} color="black" />
            }></IconButton>
        </>
      );
    },
  });
  useEffect(() => {
    QrImageData?.toDataURL(data => {
      setQrImage('data:image/png;base64,' + data);
    });
  });

  const submitHandler = async () => {
    setShowQr(true);

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
    // const uid = auth?.currentUser.uid;
  };

  const saveHandler = async () => {
    if (Platform.OS === 'android') {
      var isReadGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    }
    if (isReadGranted === PermissionsAndroid.RESULTS.GRANTED) {
      const dirs = RNFetchBlob.fs.dirs;
      var qrcode_data = QrImage?.split('data:image/png;base64,');

      const filePath =
        dirs.DownloadDir + '/' + 'QRCode' + new Date().getSeconds() + '.png';
      RNFetchBlob.fs
        .writeFile(filePath, qrcode_data[1], 'base64')
        .then(() => {
          RNFetchBlob.android.addCompleteDownload({
            title: 'QRCode',
            description: 'QRCode',
            mime: 'image/png',
            path: filePath,
            showNotification: true,
          });
        })
        .catch(errorMessage =>
          Alert.alert('There is some problem in saving file right now'),
        );
    }
    if (Platform.OS === 'ios') {
      const options = {
        title: 'Share is your QRcode',
        url: QrImage,
      };
      try {
        await Share.open(options);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleShare = async () => {
    const options = {
      title: 'Share this QRcode',
      type: 'application/pdf',
      url: QrImage,
    };
    try {
      await Share.open(options);
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handlePress = () => {
    navigation.navigate('AttendanceList');
  };
  return (
    <>
      <Center w="100%">
        <Box safeArea p="2" paddingBottom={'8'} paddingTop="4" w="90%">
          <Button
            android_ripple={{
              color: 'white',
            }}
            marginBottom={5}
            onPress={() => submitHandler()}
            padding={3}
            variant={'solid'}>
            <Text color={'white'}>Get Your QR Code</Text>
          </Button>
          <Button
            android_ripple={{
              color: 'white',
            }}
            marginBottom={5}
            onPress={() => handlePress()}
            padding={3}
            variant={'solid'}>
            <Text color={'white'}>Get Attendance List</Text>
          </Button>
          {!collegeName ? (
            <Center>{showQr ? <Spinner color="green.500" /> : <></>}</Center>
          ) : (
            <Center w={'100%'}>
              <Box p="2" paddingBottom={'8'} paddingTop="4">
                <QRCode
                  value={collegeName ? collegeName : 'NA'}
                  size={300}
                  color="black"
                  backgroundColor="white"
                  getRef={c => setQrImageData(c)}
                />

                <Button
                  android_ripple={{
                    color: 'white',
                  }}
                  isDisabled={QrImage === null ? true : false}
                  onPress={() => saveHandler()}
                  style={{
                    marginTop: 20,
                    padding: 6,
                    backgroundColor: 'green',
                  }}>
                  <Text color={'white'}>Save QR Code</Text>
                </Button>
                <Button
                  onPress={() => handleShare()}
                  android_ripple={{
                    color: 'white',
                  }}
                  isDisabled={QrImage === null ? true : false}
                  style={{
                    marginTop: 15,
                    padding: 6,
                    backgroundColor: 'green',
                  }}>
                  <Text color={'white'}>Share QR Code</Text>
                </Button>
              </Box>
            </Center>
          )}
        </Box>
      </Center>
    </>
  );
};
export default GenerateQr;
