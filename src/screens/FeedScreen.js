import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FeedScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Feed Screen</Text>
      <Button title="Camera" onPress={() => navigation.navigate('Camera')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedScreen;
