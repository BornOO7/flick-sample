import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feed'>;

const FeedScreen: React.FC<{ route: any }> = ({ route }) => {
  const { photo } = route.params;
  const navigation = useNavigation<FeedScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Camera')} style={styles.topButton}>
        <Text style={styles.topButtonText}>Camera</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Feed</Text>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonTextGolden}>Feed</Text>
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
  topButton: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    position: 'absolute',
    top: 50,
  },
  topButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CFA663',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  buttonTextGolden: {
    color: '#CFA663',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
