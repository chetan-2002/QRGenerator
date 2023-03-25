import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {
  Box,
  Button,
  Center,
  IconButton,
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

const GenerateQr = ({navigation}) => {
  const [collegeName, setCollegeName] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [QrImage, setQrImage] = useState(null);
  const [QrImageData, setQrImageData] = useState(null);

  navigation.setOptions({
    headerRight: () => {
      return (
        <>
          <IconButton
            onPress={() => navigation.replace('Login')}
            icon={
              <MaterialIcons name="logout" size={25} color="black" />
            }></IconButton>
        </>
      );
    },
  });
  useEffect(() => {
    if (collegeName.length === 0) {
      setShowQr(false);
    }
    QrImageData?.toDataURL(data => {
      setQrImage('data:image/png;base64,' + data);
    });
  }, [collegeName, QrImage]);

  const submitHandler = () => {
    const uid = auth?.currentUser.uid;
    const q = query(collection(db, 'collegeAdmins'), where('uid', '==', uid));
    onSnapshot(q, snapshot => {
      snapshot.docs.forEach(doc => {
        const data = doc.data().collegeName;
        setCollegeName(data);
      });
    });

    setShowQr(true);
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
          Alert.alert('Thereis some problem in saving file right now'),
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
  return (
    <>
      <Center w="100%">
        <Box safeArea p="2" paddingBottom={'8'} paddingTop="4" w="90%">
          {/* <FormControl
            marginBottom={5}
            isRequired
            isInvalid={collegeNameRequired && collegeName == ''}>
            <FormControl.Label>College name:</FormControl.Label>
            <Input
              isFocused={true}
              fontSize={16}
              type="text"
              variant="underlined"
              value={collegeName}
              onChangeText={val => {
                setCollegeName(val);
              }}
              placeholder="Enter college name"
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}>
              College name is required
            </FormControl.ErrorMessage>
          </FormControl> */}
          <Button
            android_ripple={{
              color: 'white',
            }}
            marginBottom={5}
            onPress={() => submitHandler()}
            padding={3}
            variant={'solid'}>
            <Text color={'white'}>Generate QR Code</Text>
          </Button>
          <Button
            android_ripple={{
              color: 'white',
            }}
            marginBottom={5}
            onPress={() => navigation.navigate('AttendanceList')}
            padding={3}
            variant={'solid'}>
            <Text color={'white'}>Get Attendance List</Text>
          </Button>
          {!showQr ? (
            <></>
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
