import React, { Component, useContext } from 'react'
import { View,Text,SafeAreaView,StatusBar, TouchableOpacity, Image, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import styles from './styles'
import {launchImageLibrary} from 'react-native-image-picker';
import ImageContext from './image/ImageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";


export class Profile extends Component {
    constructor(props){
        super(props)

        this.state = {
            imageProfile : "",
            name : 'Profile',
            editName : false
        }
    }

    openImagePicker = () => {
        const options = {
        storageOptions: {
            mediaType: 'photo',
            includeBase64: false
        }
        };
    
        launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
            console.log('Pemilihan gambar dibatalkan');
        } else if (response.errorCode) {
            console.log(response.errorCode, 'error');
        } else if (response) {
            try {
                const imageUri = response.assets[0].uri;
                this.setState({ imageProfile: imageUri });
            } catch (error) {
            console.log('Error saving imageProfile to AsyncStorage:', error);
            }
        }
        });
    };

    componentDidMount() {
        AsyncStorage.getItem('profileImage')
          .then((uri) => {
            if (uri) {
              this.setState({ imageProfile: uri });
            }
          })
          .catch((error) => {
            console.log('Error retrieving imageProfile from AsyncStorage:', error);
          });
      
        AsyncStorage.getItem('name')
          .then((name) => {
            if (name) {
              this.setState({ name });
            }
          })
          .catch((error) => {
            console.log('Error retrieving name from AsyncStorage:', error);
          });
      }
      

      handleSelesai = async () => {
        const { imageProfile, name } = this.state;
        try {
          await AsyncStorage.setItem('profileImage', imageProfile);
          console.log('Gambar berhasil disimpan');
          await AsyncStorage.setItem('name', name);
          console.log('Nama berhasil disimpan');
          this.props.navigation.goBack();
        } catch (error) {
          console.log('Terjadi kesalahan saat menyimpan gambar atau nama:', error);
        }

      };
      
    

    render() {
        const { imageProfile } = this.state;

        return (
            <ImageContext.Provider value={{imageProfile, updateImageProfile: this.props.updateImageProfile}}>
            <SafeAreaView style={{flex:1, backgroundColor:'#D3F4D6'}}>
                <StatusBar barStyle="dark-content" backgroundColor={'#37A048'} />
                <View style={{flex:1}}>
                    <View style={styles.navContainerProfile}>
                        <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
                            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                                <Icon
                                    name= 'chevron-circle-left'
                                    size= {35}
                                    color = "#fff"
                                    style={{marginRight : 15}}
                                />
                            </TouchableOpacity>
                            <Text style={{color:'#fff', fontFamily:'Manrope', fontSize:20, fontWeight:'bold'}}>Create your profile</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={this.openImagePicker} style={{marginTop:50, position:'relative'}}>
                            {imageProfile ? (
                                    <Image
                                        source={{ uri: imageProfile }}
                                        style={{height:200,width:200, borderRadius:100, borderWidth:2, borderColor:'#3B9F45'}}
                                    />
                                    ) : (
                                    <Image
                                        source={require("./image/profil1.jpg")}
                                        style={{height:200,width:200, borderRadius:100, borderWidth:2, borderColor:'#3B9F45'}}
                                    />
                                    )}
                                <View style={{position:'absolute',top:80, right:-15 ,backgroundColor:'#D3F4D6', height:35, width:35, justifyContent:'center', alignItems:'center', borderRadius:10}}>
                                    <Icon
                                        name="camera"
                                        size={30}
                                        color='#3B9F45'
                                    />
                                </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.menuContainer, {marginTop:30, position:'relative', alignItems:'center'}]}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center',flex:1}}>
                                <Icon
                                    name= "user"
                                    size={30}
                                    color='#3B9F45'
                                />
                                <Text style={{fontFamily:'Manrope', fontWeight:'bold', color:'#3B9F45',marginLeft:15}}>{this.state.name.toUpperCase()}</Text>
                            </View>
                            <TouchableOpacity onPress={()=> this.setState({editName : true})}>
                                <Icon
                                    name= "edit"
                                    size={30}
                                    color='#3B9F45'
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ height:50, width:'100%', position:'absolute', bottom:20, alignItems:'center', justifyContent :'center', backgroundColor:'#3B9F45', borderRadius:20}}
                        onPress={this.handleSelesai}>
                            <View>
                                <Text style={{fontSize:20, fontFamily:'Manrope', fontWeight:'bold', color:'#fff'}}>Selesai</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* modal */}
                <Modal isVisible={this.state.editName} style={{justifyContent:'center', alignItems:'center'}}>
                    <View style={{height:185, width:320, backgroundColor:'#3B9F45', borderRadius:20}}>
                        <View style={{marginTop:15}}>
                            <Text style={{color:'#fff', fontSize:17, fontWeight:'bold', paddingHorizontal:10, marginBottom:5}}>Edit Nama</Text>
                            <TextInput
                                value={this.state.name}
                                placeholderTextColor={'#95D59B'}
                                placeholder='Masukkan Nama Anda'
                                onChangeText={(text)=> this.setState({name : text})}
                                style={{marginHorizontal: 10, backgroundColor :'#FFF', height:50, borderRadius:5, fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center',color:'#2B6E35', paddingVertical:5}}
                            />
                        </View>
                        <View  style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10, marginTop:20}}>
                            <TouchableOpacity style={{height:45, width:130, backgroundColor:'#FF6C6C', borderRadius:10, justifyContent:'center',alignItems:'center'}}
                            onPress={()=> this.setState({editName : false})}>
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'#2B6E35',height:45, width:130,borderRadius:10, justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}
                                onPress={()=> this.setState({editName : false})}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
            </ImageContext.Provider>
        )
    }
}

export default Profile
