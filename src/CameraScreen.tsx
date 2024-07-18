import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, CameraPermissionStatus, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Worklets } from 'react-native-worklets-core';
import { scanFaces, type Face } from 'vision-camera-trustee-face-detector-v3';
import { RootStackParamList } from './types';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

const CameraScreen: React.FC = () => {
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'front'); // Select the front camera
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined');
  const [faces, setFaces] = useState<Face[]>([]);
  const camera = useRef<Camera>(null);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermissionStatus(status);
    })();
  }, []);

  const handleFaceDetection = Worklets.createRunInJsFn((faces: Face[]) => {
    runOnJS(setFaces)(faces);
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const scannedFaces = scanFaces(frame);
      if (scannedFaces.length > 0) {
        handleFaceDetection(scannedFaces);
      }
    } catch (error) {
      console.error(error);
    }
  }, [handleFaceDetection]);

  const captureImage = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      console.log('Photo captured', photo);
      navigation.navigate('Feed', { photo }); // Navigate to Feed screen with photo parameter
    }
  };

  if (cameraPermissionStatus !== 'granted' || !device) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => Camera.requestCameraPermission()} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera</Text>
      <View style={styles.cameraBorder}>
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            pixelFormat="yuv"
          />
          <Canvas style={StyleSheet.absoluteFill}>
            {faces.map((face, index) => (
              <Rect
                key={index}
                x={face.boundingBox.left}
                y={face.boundingBox.top}
                width={face.boundingBox.width}
                height={face.boundingBox.height}
                color="red"
                style="stroke"
                strokeWidth={2}
              />
            ))}
          </Canvas>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={captureImage} style={styles.button}>
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Feed', { photo: {} })} style={styles.button}>
          <Text style={styles.buttonText}>Feed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F5F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CFA663',
    marginTop: 20,
  },
  cameraBorder: {
    padding: 10,
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 10,
    marginTop: 20,
  },
  cameraContainer: {
    width: 300,
    height: 500,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    position: 'absolute',
    bottom: 50,
  },
  button: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  permissionButton: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CameraScreen;
