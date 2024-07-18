import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera, useCameraDevices, CameraDevice } from 'react-native-vision-camera';
import { Skia, Canvas, Text as SkiaText, useFont, Rect } from '@shopify/react-native-skia';
import { FaceDetector } from 'react-native-vision-camera';
import { useWindowDimensions } from 'react-native';

const CameraScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [faces, setFaces] = useState<any[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.front;
  const { width, height } = useWindowDimensions();
  const font = useFont(require('../../assets/fonts/Arizonia-Regular.ttf'), 32); // Ensure to include the font file in your project

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const handleFacesDetected = ({ faces }: { faces: any[] }) => {
    setFaces(faces);
  };

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      setPhotos([...photos, photo.uri]);
      navigation.navigate('Feed', { photos: [...photos, photo.uri] });
    }
  };

  if (!device) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!hasPermission) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device as CameraDevice}
        isActive={true}
        frameProcessor={handleFacesDetected}
        frameProcessorFps={1}
      />
      <Canvas style={styles.camera}>
        {faces.map((face, index) => (
          <Rect
            key={index}
            x={face.bounds.origin.x}
            y={face.bounds.origin.y}
            width={face.bounds.size.width}
            height={face.bounds.size.height}
            color="red"
          />
        ))}
        {font && (
          <SkiaText
            text="flick"
            x={width / 2 - 40}
            y={height - 50}
            font={font}
            color="white"
          />
        )}
      </Canvas>
      <View style={styles.buttonContainer}>
        <Text style={styles.button} onPress={takePicture}>Take Picture</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 18,
    color: 'goldenrod',
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
});

export default CameraScreen;
