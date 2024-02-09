import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';

const NavigationName = () => {
    const [name, setName] = useState('Profile');
  
    const loadName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        console.log('Nama berhasil diambil dari AsyncStorage');
        setName(storedName);
      } catch (error) {
        console.log('Terjadi kesalahan saat mengambil nama dari AsyncStorage:', error);
      }
    };
    
  
    useEffect(() => {
      loadName()
    }, []);
  
    useFocusEffect(() => {
      loadName()
    });
  
    return (
      <View>
         {name && <Text style={styles.navBarText}>{name.toUpperCase()}</Text>}
      </View>
    );
  };
  
  export default NavigationName;
  