import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeGema from './screen/Gema';
import Bisnis from './screen/Bisnis';
import Profile from './screen/Profile';
import React,{useEffect, useState} from 'react';
import { View,Image } from 'react-native';
import NewInstall from './screen/NewInstall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Continue from './screen/Continue';

const Stack = createNativeStackNavigator();
function App(){
  const [isLoading, setIsLoading] = useState(true)
  const [install, setInstall] = useState(false)

  useEffect(()=> {
    setTimeout(() => {
      setIsLoading(false)
    }, 800);
    checkAppInstallation()
  },[])

  const checkAppInstallation= async ()=> {
    try {
      const appInstalledStatus = await AsyncStorage.getItem('isAppInstalled');
      if (appInstalledStatus === null) {
          // Aplikasi belum diinstal sebelumnya
          setInstall(false)
      } else {
          // Aplikasi telah diinstal sebelumnya
          setInstall(true)
      }
  }catch{
    console.log('error')
  }
}

  if (isLoading) {
    // Jika isLoading bernilai true, tampilkan komponen loading
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff' }}>
            <Image source={require('./screen/image/logoLoding.png')} style={{height:250, width:250}}/>
        </View>
    );
  }



  if(!install){
    return(
      <NavigationContainer>
      <Stack.Navigator initialRoute="Continue" screenOptions={{headerShown: false, animation:'none'}}>
        <Stack.Screen name='Continue'>
          {(props) => <Continue {...props} install={setInstall}/>}
        </Stack.Screen>
        <Stack.Screen name='NewInstall' component={NewInstall}/>
      </Stack.Navigator>
    </NavigationContainer>
    )
  }

  return(
    <NavigationContainer>
      <Stack.Navigator initialRoute="Bisnis" screenOptions={{headerShown: false, animation:'none'}}>
        <Stack.Screen name='Bisnis' component={Bisnis}/>
        <Stack.Screen name='Home' component={HomeGema}/>
        <Stack.Screen name='Profile' component={Profile}/>
        <Stack.Screen name='NewInstall' component={NewInstall}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;