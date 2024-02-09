import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';

const NavigationProfile = ({navigation}) => {
  const [imageProfile, setImageProfile] = useState(null);
  var width = Dimensions.get('window').width

  const loadImageProfile = async () => {
    try {
      const storedImageProfile = await AsyncStorage.getItem('profileImage');
      console.log('Gambar profil berhasil diambil dari AsyncStorage');
      setImageProfile(storedImageProfile);
    } catch (error) {
      console.log('Terjadi kesalahan saat mengambil gambar profil dari AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadImageProfile();
  }, []);

  useFocusEffect(() => {
    loadImageProfile();
  });

  return (
    
    <View>
      {imageProfile ? (
          <Image
            source={{ uri: imageProfile }}
            style={{aspectRatio: 1,borderRadius: 100,borderWidth: 2,borderColor: '#3B9F45',resizeMode: 'contain'}}
          />
        ) : (
          <Image
            source={require("./image/profil1.jpg")}
            style={{aspectRatio: 1,borderRadius: 100,borderWidth: 2,borderColor: '#3B9F45',resizeMode: 'contain', height:width*0.11}}
          />
        )}

    </View>
  );
};

export default NavigationProfile;
