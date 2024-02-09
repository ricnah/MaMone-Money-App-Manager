import { Image,Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Continue ({navigation, install}) {
    const handleAppInstallation = async () => {
        try {
          // Simpan status instalasi ke AsyncStorage
          await AsyncStorage.setItem('isAppInstalled', 'true');
          // Setel state untuk menandai bahwa aplikasi telah diinstal
          install(true);
        } catch (error) {
          console.log('Error saving app installation status:', error);
        } // Gunakan objek navigasi untuk navigasi ke halaman NewInstall
        navigation.navigate('NewInstall')
      };
    return( 
        <View style={{flex:1, backgroundColor:'#fff',justifyContent:'center', alignItems:'center', position:'relative'}}>
            <View>
                <Image source={require('./image/logoLoding.png')} style={{height:250, width:250, marginTop:-150}}/>
            </View>
            <View style={{width:'90%',position:'absolute', bottom:60}}>
            <View>
                <Text style={{color:'#3B9F45', fontSize:35, fontWeight:'bold', fontFamily:'Manrope'}}>Welcome!</Text>
                <Text style={{color:'#3B9F45', fontSize:15}}>Plan your finance with MaMone Buddy</Text>
            </View>
            <TouchableOpacity style={{marginTop:20, height:50, width:'100%', backgroundColor:'#BDFACB', borderRadius:20, borderWidth:2, borderColor:'#37A048', justifyContent:'center', alignItems:'center'}}
            onPress={handleAppInstallation}>
                <Text style={{fontSize:18, fontWeight:'bold', color:'#37A048'}}>Continue</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default Continue