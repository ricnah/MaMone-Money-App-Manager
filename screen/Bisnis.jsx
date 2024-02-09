import React from 'react';
import {Text, View, StatusBar, TouchableOpacity,TextInput, ScrollView,Image,Dimensions, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Modal from "react-native-modal";
import styles from './styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import NavigationProfile from './NavigationProfile';
import NavigationName from './NavigationName';


class Bisnis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataMenu: [],
            selectedItems:[],
            tambahNote: false,
            uang: 0,
            pilihanYangDiseleksi: false,
            iconMasuk: true,
            uangMasukBisnis: 0,
            uangKeluarBisnis: 0,
            showDatePicker: false,
            date: new Date(),
            filteredData: [],
            showTotalUang: false,
            totalUang: 0,
            menuBisnis: true,
            namaMenu : '',
            harga : 0,
            gambar : '',
            tambahMenuBaru : false,
            imageUri : null,
            isLoading :true,
            jumlah : 0,
            selectedDate: '',
            totalHarga : 0,
            menuBelanja : false,
            namaBelanja : '',
            totalBelanja :0,
            totalUangBisnis : 0,
            selectedItem : null,
            editMenu : false,
        };
        this.handleLanjutkan = this.handleLanjutkan.bind(this);
    }
    showFormattedAllDate = (date) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(date).toLocaleDateString('id-ID', options);
    };
    
    showFormattedYearAndMonth = (date) => {
        const options = {
        month: 'long',
        year: 'numeric',
        };
        return new Date(date).toLocaleDateString('id-ID', options);
    };
    
    showFormattedDate = (date) => {
        const options = {
        day: 'numeric',
        };
        return new Date(date).toLocaleDateString('id-ID', options);
    };
    
    showFormattedMonth = (date) => {
        const options = {
        month: 'long',
        };
        return new Date(date).toLocaleDateString('id-ID', options);
    };
    
    showFormattedYear = (date) => {
        const options = {
        year: 'numeric',
        };
        return new Date(date).toLocaleDateString('id-ID', options);
    };
    
      getDataMenu = async () => {
        try {
          const dataMenu = await AsyncStorage.getItem('dataMenu');
          if (dataMenu !== null) {
            this.setState({ dataMenu: JSON.parse(dataMenu) });
          }
        } catch (error) {
          console.log('Terjadi kesalahan saat mengambil data dari AsyncStorage:', error);
        }
      };

      tambahMenu = () => {
        const { dataMenu, namaMenu, harga, imageUri, jumlah } = this.state;
      
        const newEntry = {
          id: +new Date(),
          namaMenu: namaMenu,
          harga: harga,
          imageUri: imageUri,
          jumlah: jumlah,
        };
      
        const updatedDataMenu = [...dataMenu, newEntry];
      
        AsyncStorage.setItem('dataMenu', JSON.stringify(updatedDataMenu))
          .then(() => {
            console.log('Data Menu berhasil disimpan ke AsyncStorage setelah penambahan');
            this.setState({
              dataMenu: updatedDataMenu,
              tambahMenuBaru: false,
              namaMenu: '',
              harga: 0,
              imageUri: '',
              jumlah: 0,
            });
          })
          .catch((error) => {
            console.log('Terjadi kesalahan saat menyimpan data ke AsyncStorage setelah penambahan:', error);
          });
      };
      

    componentDidMount() {
        this.getDataMenu()
        this.getSelectedItemsFromStorage()
    };

    componentDidUpdate(prevProps, prevState) {
        const { selectedItems } = this.state;
        const { uangMasukBisnis, uangKeluarBisnis } = this.state;
        const { uangMasukBisnis: prevUangMasukBisnis, uangKeluarBisnis: prevUangKeluarBisnis } = prevState;
    
        // Check if uangMasukBisnis or uangKeluarBisnis has changed
        if (uangMasukBisnis !== prevUangMasukBisnis || uangKeluarBisnis !== prevUangKeluarBisnis) {
          // Calculate the updated totalUangBisnis value
          const updatedTotalUangBisnis = uangMasukBisnis - uangKeluarBisnis;

          // Update the state and AsyncStorage with the new totalUangBisnis value
          this.setState({ totalUangBisnis: updatedTotalUangBisnis }, () => {
            AsyncStorage.setItem('totalUangbisnis', updatedTotalUangBisnis.toString())
              .then(() => {
                console.log('totalUangbisnis berhasil disimpan ke AsyncStorage setelah perubahan uangMasukBisnis atau uangKeluarBisnis');
              })
              .catch((error) => {
                console.log('Terjadi kesalahan saat menyimpan totalUangbisnis ke AsyncStorage setelah perubahan uangMasukBisnis atau uangKeluarBisnis:', error);
              });
          });
        }
        if (selectedItems !== prevState.selectedItems) {
          this.filterDataByDate(); // Memperbarui data yang dirender di history
        }
      }
      
      async getSelectedItemsFromStorage() {
        try {
            const uangMasukBisnis = await AsyncStorage.getItem('uangMasukBisnis');
            const uangKeluarBisnis = await AsyncStorage.getItem('uangKeluarBisnis');
            const selectedItemsJSON = await AsyncStorage.getItem('selectedItems');
            const totalUangBisnis = await AsyncStorage.getItem('totalUangBisnis');
            if (selectedItemsJSON !== null ) {
                const selectedItems = JSON.parse(selectedItemsJSON);
                this.setState({
                    selectedItems : selectedItems,
                    uangMasukBisnis : parseFloat(uangMasukBisnis),
                    uangKeluarBisnis : parseFloat(uangKeluarBisnis),
                    totalUangBisnis : parseFloat(totalUangBisnis),
                },
                    ()=> { 
                        this.filterDataByDate()
                    });
                }
        } catch (error) {
            console.log('Error retrieving selected items from AsyncStorage:', error);
        }
    }

    // Metode untuk menghapus semua dataMenu dari AsyncStorage
    hapusMenu = (id) => {
        const { dataMenu } = this.state
        const updatedDataMenu = dataMenu.filter((item) => item.id !== id);
      
        AsyncStorage.setItem('dataMenu', JSON.stringify(updatedDataMenu))
          .then(() => {
            this.setState({ dataMenu: updatedDataMenu });
          })
          .catch((error) => {
            console.log('Terjadi kesalahan saat menyimpan data ke AsyncStorage setelah penghapusan:', error);
          });
      };

      hapusHistory = (id) => {
        const { filteredData, uangMasukBisnis, uangKeluarBisnis, totalUangBisnis } = this.state;
      
        // Filter out the deleted item from the filteredData array
        const updatedDataMenu = filteredData.filter((item) => item.id !== id);
      
        // Calculate the updated uangMasukBisnis and uangKeluarBisnis values
        let updatedUangMasukBisnis = 0;
        let updatedUangKeluarBisnis = 0;
      
        updatedDataMenu.forEach((item) => {
          if (item.iconMasuk) {
            updatedUangMasukBisnis += parseFloat(item.totalHarga);
          } else {
            updatedUangKeluarBisnis += parseFloat(item.totalHarga);
          }
        });
    
        // Calculate the updated totalUangBisnis value
        const updatedTotalUangBisnis = updatedUangMasukBisnis - updatedUangKeluarBisnis
      
        AsyncStorage.setItem('selectedItems', JSON.stringify(updatedDataMenu))
          .then(() => {
            this.setState({
              selectedItems: updatedDataMenu,
              uangMasukBisnis: updatedUangMasukBisnis,
              uangKeluarBisnis: updatedUangKeluarBisnis,
              totalUangBisnis: updatedTotalUangBisnis,
            });
            AsyncStorage.setItem('uangMasukBisnis', updatedUangMasukBisnis.toString())
              .then(() => {
                console.log('uangMasukBisnis berhasil disimpan ke AsyncStorage setelah penghapusan');
                AsyncStorage.setItem('uangKeluarBisnis', updatedUangKeluarBisnis.toString())
                  .then(() => {
                    console.log('uangKeluarBisnis berhasil disimpan ke AsyncStorage setelah penghapusan');
                    AsyncStorage.setItem('totalUangbisnis', updatedTotalUangBisnis.toString())
                      .then(() => {
                        console.log('totalUangbisnis berhasil disimpan ke AsyncStorage setelah penghapusan');
                      })
                      .catch((error) => {
                        console.log('Terjadi kesalahan saat menyimpan totalUangbisnis ke AsyncStorage setelah penghapusan:', error);
                      });
                  })
                  .catch((error) => {
                    console.log('Terjadi kesalahan saat menyimpan uangKeluarBisnis ke AsyncStorage setelah penghapusan:', error);
                  });
              })
              .catch((error) => {
                console.log('Terjadi kesalahan saat menyimpan uangMasukBisnis ke AsyncStorage setelah penghapusan:', error);
              });
          });
      };

      loadSelectedItems = () => {
        AsyncStorage.getItem('selectedItems')
          .then((selectedItems) => {
            if (selectedItems) {
              this.setState({ selectedItems: JSON.parse(selectedItems) });
            }
          })
          .catch((error) => {
            console.log('Error loading selectedItems from AsyncStorage:', error);
          });
      };
      
      

    showDatePicker = () => {
        this.setState({ showDatePicker: true });
    };
    
    hideDatePicker = () => {
        this.setState({ showDatePicker: false });
    };
    
    handleDateChange = selectedDate => {
        if (selectedDate) {
            const formattedDate = this.showFormattedAllDate(selectedDate);
            this.setState({ selectedDate: formattedDate, date: selectedDate }, () => {
                this.filterDataByDate(); // Pemfilteran otomatis setelah mengubah tanggal
            });
        }
        this.hideDatePicker();
    };
    
    filterDataByDate = () => {
    const { selectedDate, selectedItems } = this.state;
    let filteredData = [];
    
    if (selectedDate === '') {
        // Tanggal otomatis berubah
        const currentDate = this.showFormattedDate(new Date().toISOString())
        const currentMonth = this.showFormattedMonth(new Date().toISOString())
        const currentYear = this.showFormattedYear(new Date().toISOString())

        console.log(currentDate, currentMonth, currentYear)
    
        filteredData = selectedItems.filter((item) => {
        const itemDay = item.tanggalCus
        const itemMonth = item.bulanCus
        const itemYear = item.tahunCus
    
        return (
            currentDate === itemDay &&
            currentMonth === itemMonth &&
            currentYear === itemYear
        );
        });
    } else {
        // Tanggal dipilih secara manual
        filteredData = selectedItems.filter((item) => item.timeAll === selectedDate);
    }
    
    this.setState({ filteredData });
    };
    
    handleBisnisPress = () => {
        this.setState({
            menuBisnis: true,
        });
    };
    
    handleHistoryPress = () => {
        this.setState({
            menuBisnis: false,
        });
    };

    calculateTotalUang = (data) => {
        let uangMasukBisnis = 0;
        let uangKeluarBisnis = 0;
    
        data.forEach(item => {
            if (item.iconMasuk) {
                uangMasukBisnis += parseFloat(item.totalHarga); // Menggunakan parseFloat untuk mengonversi string ke angka
            } else {
                uangKeluarBisnis += parseFloat(item.totalHarga); // Menggunakan parseFloat untuk mengonversi string ke angka
            }
        });
    
        const totalUang = uangMasukBisnis - uangKeluarBisnis;
        return { uangMasukBisnis, uangKeluarBisnis, totalUang };
    };

    openImagePicker = () => {
        const options = {
        storageOptions : {
            mediaType : 'photo',
            includeBase64 : false
            }
        };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log('Image picker cancelled');
            } else if (response.error) {
              console.log('Image picker error:', response.error);
            } else {
                const imageUri = response.assets[0].uri;
                this.setState({imageUri : imageUri})
                this.setState((prevState) => ({
                  selectedItem: {
                    ...prevState.selectedItem,
                    imageUri: imageUri,
                  },
                }));
            }
        })
    }

    handleDecrement = (itemId) => {
        this.setState((prevState) => {
          const updatedDataMenu = prevState.dataMenu.map((item) => {
            if (item.id === itemId && item.jumlah > 0) {
              return { ...item, jumlah: item.jumlah - 1 };
            }
            return item;
          });
      
          return { dataMenu: updatedDataMenu };
        });
      };
      
      handleIncrement = (itemId) => {
        this.setState((prevState) => {
          const updatedDataMenu = prevState.dataMenu.map((item) => {
            if (item.id === itemId) {
              return { ...item, jumlah: item.jumlah + 1 };
            }
            return item;
          });
      
          return { dataMenu: updatedDataMenu };
        });
      };
      
      

    getTotalHarga() {
        let total = 0;
        this.state.dataMenu.forEach((item) => {
             total += item.jumlah * item.harga;
        });
        return total;
    }

    getSelectedItems = () => {
        const { dataMenu } = this.state;
        return dataMenu.filter((item) => item.jumlah > 0 && !item.menuBisnis);
      };


      handleLanjutkan() {
        const { dataMenu, selectedItems, uangMasukBisnis, menuBelanja} = this.state;
        const updatedSelectedItems = [...selectedItems];
        const updatedDataMenu = dataMenu.map((item) => ({
          ...item,
          jumlah: 0,
        }));
      
        let currentTime = new Date().toISOString();
        const tanggalCus = this.showFormattedDate(currentTime);
        const tahunCus = this.showFormattedYear(currentTime);
        const waktuIso = currentTime;
        const timeAll = this.showFormattedAllDate(currentTime);
        const bulanCus = this.showFormattedMonth(currentTime);
        let updatedUangMasukBisnis = uangMasukBisnis;
        let updatedUangKeluarBisnis = this.state.uangKeluarBisnis
        if(menuBelanja===true){
            const belanjaBaru = {
                id : +new Date(),
                namaMenu : this.state.namaBelanja,
                iconMasuk : false,
                tanggalCus : tanggalCus,
                bulanCus : bulanCus,
                tahunCus : tahunCus,
                waktuIso : waktuIso,
                timeAll : timeAll,
                totalHarga : this.state.totalBelanja
            };
            updatedSelectedItems.push(belanjaBaru)
            updatedUangKeluarBisnis += parseFloat(this.state.totalBelanja)

            this.setState({
                uangKeluarBisnis: updatedUangKeluarBisnis,
                tambahMenuBaru : false,
                menuBelanja : false,
                namaBelanja : '',
                totalBelanja : '',
                menuBisnis : false
            }
            );
        }
        else{
        dataMenu.forEach((item) => {
          const id = item.id + '_' + Date.now();
          if (item.jumlah > 0) {
            const totalHarga = item.jumlah * item.harga;
            const updatedItems = {
                ...item,
                tanggalCus,
                bulanCus,
                tahunCus,
                waktuIso,
                timeAll,
                id,
                totalHarga,
                iconMasuk : true
            };
            updatedSelectedItems.push(updatedItems);
            updatedUangMasukBisnis += parseFloat(totalHarga); // Menambahkan totalHarga ke uangMasukBisnis
          }
        })
        this.setState({menuBisnis:false})
        }
        
         const totalUangBisnis = updatedUangMasukBisnis - updatedUangKeluarBisnis;
            parseFloat(totalUangBisnis)
        this.setState(
          {
            selectedItems: updatedSelectedItems,
            dataMenu: updatedDataMenu,
            uangMasukBisnis: updatedUangMasukBisnis,
            totalUangBisnis : totalUangBisnis,
          },
          () => {
            AsyncStorage.setItem('selectedItems', JSON.stringify(updatedSelectedItems))
              .then(() => {
                console.log('Selected items saved to AsyncStorage:', updatedSelectedItems);
                return AsyncStorage.setItem('uangMasukBisnis', updatedUangMasukBisnis.toString());
              })
              .then(() => {
                console.log('uangMasukBisnis saved to AsyncStorage:', updatedUangMasukBisnis);
                return AsyncStorage.setItem('uangKeluarBisnis', updatedUangKeluarBisnis.toString());
              })
              .then(() => {
                console.log('uang keluar berhasil disimpan', updatedUangKeluarBisnis);
                return AsyncStorage.setItem('totalUangbisnis', totalUangBisnis.toString());
              })
              .then(() => {
                console.log('total uang bisnis keluar berhasil disimpan', totalUangBisnis);
              })
              .catch((error) => {
                console.log('Error saving data to AsyncStorage:', error);
              });
          }
          
        );
    }

    handleInputChange = (text) => {
        // Hanya memperbarui state jika input hanya terdiri dari angka
        if (/^\d*$/.test(text)) {
            this.setState({ harga: text });
        }
    };

    handleInputBelanjaChange = (text) => {
        // Hanya memperbarui state jika input hanya terdiri dari angka
        if (/^\d*$/.test(text)) {
            this.setState({ totalBelanja : text });
        }
    };

    handleMenuBelanja = ()=> {
        this.setState({menuBelanja : true})
    }
    handleMenuTambah = ()=> {
        this.setState({menuBelanja : false})
    }

    editMenu = () => {
        const { selectedItem, dataMenu, imageUri} = this.state;

        if (selectedItem !== null) {
          const selectedIndex = dataMenu.findIndex((item) => item.id === selectedItem.id);
      
          if (selectedIndex !== -1) {
            const updatedData = [...dataMenu];
            updatedData[selectedIndex] = {
              ...selectedItem,
              namaMenu: selectedItem.namaMenu,
              harga: selectedItem.harga,
              imageUri: selectedItem.imageUri,
            };
      

        AsyncStorage.setItem('dataMenu', JSON.stringify(updatedData))
            .then(() => {
            console.log('Menu edited successfully');
            // Set the state with updated dataMenu and filteredData
            this.setState(
                {
                dataMenu: updatedData,
                selectedItem: null,
                editMenu: false,
                imageUri : ''
                },
                () => {
                this.getDataMenu();
                }
            );
            })
            .catch((error) => {
            console.log('Error saving dataMenu:', error);
            });
        }
    }
    }

    deleteMenu = () => {
        const { selectedItem, dataMenu} = this.state;

        if (selectedItem !== null) {
            const updatedData = dataMenu.filter((item) => item.id !== selectedItem.id);

        AsyncStorage.setItem('dataMenu', JSON.stringify(updatedData))
            .then(() => {
            console.log('Menu edited successfully');
            // Set the state with updated dataMenu and filteredData
            this.setState(
                {
                dataMenu: updatedData,
                selectedItem: null,
                editMenu: false,
                },
                () => {
                this.getDataMenu();
                }
            );
            })
            .catch((error) => {
            console.log('Error saving dataMenu:', error);
            });
        }
    }
    

    handleItemPress = (item) => {
        this.setState({
          editMenu : true,
          selectedItem: item
        });
      };
    
    


    render() {
        const {showDatePicker, date, filteredData, menuBisnis, selectedItem, menuBelanja} = this.state;
        const formattedDate = moment(date).format('DD MMMM YYYY');
        let currentTime = new Date().toISOString()
        var height = Dimensions.get("window").height
        var width = Dimensions.get('window').width
        
        return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar barStyle="dark-content" backgroundColor={'#D3F4D6'} />
            <View style={styles.navContainer}>
                <View style={styles.navItem}>
                    <TouchableOpacity style={styles.iconNavbar}
                    onPress={()=> this.props.navigation.navigate('Profile')}>
                    <NavigationProfile/>
                    </TouchableOpacity>
                    <NavigationName/>
                </View>
                <Image source={require('./image/9.png')} style={{height:50, width:55, aspectRatio:1, resizeMode:'contain'}}/>
            </View>

            <View style={{flex: 1, backgroundColor:'#D3F4D6', alignItems:'center'}}>
                <View>
                        <View style={styles.heroCont1}>
                            <View style={styles.heroCont2}>
                                <View style={styles.heroCont3}>
                                    <View style={{ justifyContent:'center',alignItems:'center'}}>
                                        <TouchableOpacity style={{height: width*0.09, width:width*0.65, backgroundColor: '#3B9F45', borderRadius:20, justifyContent:'center',alignItems:'center', flexDirection:'row',}}
                                        onPress={()=> this.setState({showTotalUang : true})}>
                                            <Text style={{fontSize:15, fontWeight:'bold', color :'#FFF'}}>BISNIS</Text>
                                            <Icon
                                                name = 'info-circle'
                                                size = {15}
                                                color = "#fff"
                                                style={{marginLeft:15}}
                                            /> 
                                        </TouchableOpacity>
                                        {/* MODAL TOTAL */}
                                        <Modal isVisible={this.state.showTotalUang}>  
                                            <View style={{height:210, borderRadius:20, alignItems:'center', backgroundColor:'#3B9F45', position:'relative'}}>
                                                <View style={{width:300, height:50, alignItems:'center',justifyContent:'center', borderColor:'#BDFACB', backgroundColor:'#FFF', borderWidth:1, borderRadius:15, marginTop:25}}>
                                                    <Text style={{fontSize: 20, fontWeight:'bold', color:'#3B9F45', fontFamily:'Manrope'}}>
                                                        {this.showFormattedYearAndMonth(currentTime)}
                                                    </Text>
                                                </View>
                                                <View style={{alignItems:'center', justifyContent:'center', marginTop:10, height:95, width:300 , borderWidth:1,borderColor:'#BDFACB', backgroundColor:'#FFF', borderRadius:15}}>
                                                    <Text style={{paddingVertical:3,fontSize:20, fontFamily:'Manrope', fontWeight:'bold', color:'#3B9F45'}}>Total uang anda : </Text>
                                                    <View style={{borderWidth:0.6, width:250, borderColor:'#77B87D'}}/>
                                                    <Text style={{fontSize:20, fontFamily:'Manrope', fontWeight:'bold', color:'#3B9F45', marginTop:10}}>Rp.{this.state.totalUangBisnis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                                </View>
                                                <TouchableOpacity style={{justifyContent:'center', alignItems:'center', borderRadius:10, position:'absolute', top:-10, right:-10, backgroundColor:'#fff', borderRadius:20}}
                                                onPress={()=> this.setState({showTotalUang : false})}>
                                                    <Icon
                                                        name = 'times-circle'
                                                        size = {35}
                                                        color = '#FF6C6C'
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </Modal>
                                        <View style={{width: 245, backgroundColor:'#3B9F45', height: 2, marginTop: 13}}/>
                                    </View>
                                    <View style={{flexDirection:'row', paddingTop:5, justifyContent:'space-between'}}>
                                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                                                <Icon
                                                    name="arrow-circle-down"
                                                    size = {25}
                                                    color ="green"
                                                />
                                                <Text style={{marginLeft:10, fontWeight:700,fontSize:15, color:'#3B9F45'}}>Rp.{this.state.uangMasukBisnis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                                                <Icon
                                                    name="arrow-circle-up"
                                                    size = {25}
                                                    color ="#FF6C6C"
                                                />
                                                <Text style={{marginLeft:10, fontWeight:700,fontSize:15, color:'#3B9F45'}}>Rp.{Number(this.state.uangKeluarBisnis).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                            </View>
                                    </View>
                            </View>
                        </View>
                    </View>
                </View>
                {/* MENU */}
                <View style={{alignItems:'center', flex:1}}>
                        <View style={[styles.menuContainer, {position:'relative'}]}>
                            <View style={{ justifyContent:'center', alignItems:'center', marginBottom:8}}>
                                <View style={{height:width*0.13, width:width*0.9, borderWidth:3, borderRadius:20, borderColor:'#3B9F45', backgroundColor: '#fff',flexDirection:'row', paddingHorizontal:5, alignItems:'center', justifyContent:'space-between'}}>
                                    <TouchableOpacity style={{paddingHorizontal: 10, backgroundColor:menuBisnis ? '#3B9F45' : '#fff', width:50, height:35, borderTopLeftRadius:15, borderBottomLeftRadius:15, justifyContent:'center', alignItems:'center'}}
                                    onPress={this.handleBisnisPress}>
                                        <Icon
                                            name='shopping-cart'
                                            size={20}
                                            style={{ color: menuBisnis ? '#fff' : '#aaa' }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center',height:40, width:230, borderLeftWidth:1, borderRightWidth:1, borderColor:'#3B9F45'}}
                                    onPress={this.showDatePicker}>
                                        {/* <TouchableOpacity onPress={this.showDatePicker}>
                                            <Text>Select Date</Text>
                                        </TouchableOpacity> */}
                                        <View style={{flexDirection:'row'}}>
                                            {showDatePicker && (
                                                <DateTimePickerModal
                                                value={date}
                                                isVisible={showDatePicker}
                                                mode="date"
                                                date={date}
                                                onConfirm={this.handleDateChange}
                                                onCancel={this.hideDatePicker}
                                                locale="id-ID"
                                                isDarkModeEnabled={true}
                                                accessibilityIgnoresInvertColors = "green"
                                                display='calendar'
                                                color='green'
                                                onChange = {this.handleDateChange}
                                                />
                                            )}
                                            <Text style={{fontFamily:'Manrope', fontWeight:700, fontSize:16, lineHeight:20, color:'#3B9F45'}}>{formattedDate}</Text>
                                            <Icon
                                            name= "sort-down"
                                            color = "#3B9F45"
                                            style={{marginLeft:10}}
                                            />
                                        </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{paddingHorizontal: 10, backgroundColor:menuBisnis ? '#FFF' : '#3B9F45', width:50, height:35, borderTopRightRadius:15, borderBottomRightRadius:15, justifyContent:'center', alignItems:'center'}}
                                        onPress={this.handleHistoryPress}>
                                            <Icon
                                                name='history'
                                                size={20}
                                                style={{ color: menuBisnis ? '#aaa' : '#fff' }}
                                            />
                                        </TouchableOpacity>
                                </View>
                            </View>
                                    {/* item yg dirender */}
                                    {
                                        menuBisnis == true ?
                                        <ScrollView>
                                        <View style={{justifyContent:'center', alignItems:'center', paddingTop:10}}>{
                                                    this.state.dataMenu.map((item) => (
                                                        <TouchableOpacity key={item.id} style={styles.menuItem} onPress={()=>this.handleItemPress(item)}>
                                                            <View style={{justifyContent:'space-between', flexDirection:'row', padding: 10}}>
                                                                <Image source={{uri: item.imageUri}} style={styles.tanggalCont}/>
                                                                <View style={{paddingHorizontal:20}}>
                                                                    <View style={{width:225, paddingBottom: 10, borderBottomWidth:2, borderColor:'#77B87D'}}>
                                                                        <Text style={{color:'#FFF', fontFamily:'Manrope', fontWeight:700, fontSize:16, lineHeight:20}}>{item.namaMenu.toUpperCase()}</Text>
                                                                    </View>
                                                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                                        <Text style={{color:'#FFF', fontFamily:'Manrope', fontWeight:700, fontSize:16, lineHeight:20, marginTop:15}}>Rp.{item.harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                                                        <View style={{flexDirection:'row', marginTop:10, justifyContent:'center',alignItems:'center'}}>
                                                                        <TouchableOpacity onPress={() => this.handleDecrement(item.id)}>
                                                                            <Icon
                                                                            name="minus-circle"
                                                                            size={23}
                                                                            color='#fff'
                                                                            style={{ marginRight: 10 }}
                                                                            />
                                                                        </TouchableOpacity>
                                                                        <Text style={{ fontSize: 20, color: '#fff', marginRight: 10 }}>{item.jumlah}</Text>
                                                                        <TouchableOpacity onPress={() => this.handleIncrement(item.id)}>
                                                                            <Icon
                                                                            name="plus-circle"
                                                                            size={23}
                                                                            color='#fff'
                                                                            />
                                                                        </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ))
                                                }
                                                {this.getTotalHarga() > 0 && (
                                                        <View style={styles.menuItemTrans}/>
                                                    )}
                                                </View>
                                        </ScrollView>
                                        :
                                        <ScrollView>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                                            {
                                                filteredData.map((item) => (
                                                    <TouchableOpacity key={item.id}
                                            style={styles.menuItem} onLongPress={()=> this.hapusHistory(item.id)}>
                                            <View style={{justifyContent:'space-between', flexDirection:'row', padding: 10}}>
                                                <View>
                                                    <View style={styles.tanggalCont}>
                                                            <Text style={{ fontSize: 13,fontFamily:'Manrope', fontWeight:'bold', color:'#fff', alignItems:'center'}}>
                                                                {item.bulanCus}
                                                            </Text>
                                                            <View style={{width:'100%' , borderWidth:0.65, borderColor:'#FFF', marginTop:2}}/>
                                                            <Text style={{ fontSize: 18,fontFamily:'Manrope', fontWeight:'bold', color:'#fff', alignItems:'center'}}>
                                                                {item.tanggalCus}
                                                            </Text>
                                                            <Text style={{ fontSize: 12,fontFamily:'Manrope', fontWeight:'bold', color:'#fff', alignItems:'center'}}>
                                                                {item.tahunCus}
                                                            </Text>
                                                    </View>
                                                    </View>
                                                <View style={{paddingHorizontal:20}}>
                                                    <View style={{width:225, paddingBottom: 10, borderBottomWidth:2, borderColor:'#77B87D'}}>
                                                        <Text style={{color:'#FFF', fontFamily:'Manrope', fontWeight:700, fontSize:16, lineHeight:20}}>{item.namaMenu.toUpperCase()}</Text>
                                                    </View>
                                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                            <View style={{paddingVertical:10, flexDirection:'row',  alignItems:'center'}}>
                                                                <Text style={{textAlign:'right',color:'#FFF', fontFamily:'Manrope', fontWeight:700, fontSize:17, lineHeight:20}}>{item.jumlah}</Text>
                                                            </View>
                                                            <View>
                                                            <View style={{paddingVertical:10, flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
                                                                <View style={{backgroundColor:'#FFF', borderRadius:15}}>
                                                                {item.iconMasuk ? (
                                                                    <View style={{ backgroundColor: '#FFF', borderRadius: 15 , borderWidth:1, borderColor:'#fff'}}>
                                                                    <Icon name="arrow-circle-down" size={25} color ="green"/>
                                                                    </View>
                                                                ) : (
                                                                    <View style={{ backgroundColor: '#FFF', borderRadius: 15 , borderWidth:1, borderColor:'#fff'}}>
                                                                    <Icon name="arrow-circle-up" size={25} color ="#FF6C6C"/>
                                                                    </View>
                                                                )}
                                                                </View>
                                                                <Text style={{textAlign:'right',color:'#FFF', fontFamily:'Manrope', fontWeight:700, fontSize:17, lineHeight:20, marginLeft:10}}>
                                                                    Rp.{item.totalHarga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        ))
                                            }
                                            {/* Render the total price */}
                                            </View>
                                        </ScrollView>
                                    }
                        </View>
                        {this.getTotalHarga() > 0 && menuBisnis==true && (
                                        <TouchableOpacity style={{width:'80%', backgroundColor:'#D3F4D6', borderRadius:10,elevation:50, position:'absolute',bottom:80,}}
                                        onPress={this.handleLanjutkan}>
                                            <View style={{flexDirection:'row', height:50, alignItems:'center', justifyContent:'space-between', paddingHorizontal:20}}>
                                                <Text style={{color:"#3B9F45", fontWeight:'bold', fontSize:17}}>Lanjutkan</Text>
                                                <Text style={{ color:"#3B9F45", fontWeight:'bold', fontSize:17}}>Rp.{this.getTotalHarga().toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                        {/* PLUS */}
                <View style={styles.navBawahContain}>
                    <View style={{flexDirection:'row', flex:1 , justifyContent:'space-between', padding:10, paddingHorizontal:20, position:'relative'}}>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Bisnis')} style={{width:130, height:35,position:'relative'}}>
                            <Icon
                                name="store"
                                size= {30}
                                color = "#3B9F45"
                                style={{position :'absolute', left:20}}
                            />
                        </TouchableOpacity>
                        <View underlayColor="white" style={styles.plus}>
                            <TouchableOpacity style={{borderWidth:4, width: 50, height:50 ,justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:'#3B9F45'}}
                            onPress={()=> this.setState({tambahMenuBaru : true})}>
                                <Icon
                                    name = "plus"
                                    size= {30}
                                    color = "#3B9F45"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Home')} style={{width:130, height:35,position:'relative'}}>
                            <Icon
                                name = "user-alt"
                                size= {30}
                                color = "#aaa"
                                style={{position :'absolute', right:20}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Modal Add*/}
                <Modal isVisible={this.state.tambahMenuBaru}>
                    <View style={{height:350, borderRadius:20, justifyContent:'center', alignItems:'center', backgroundColor:'#3B9F45'}}>
                        <View style={{flexDirection:'row', height:50 ,width:310 , justifyContent:'space-between', alignItems:'center', borderTopRightRadius :15, borderTopLeftRadius:15}}>
                            <TouchableOpacity style={{ borderTopLeftRadius:15, width:155, height:50 , justifyContent:'center', alignItems:'center', backgroundColor: menuBelanja ? '#32793D' : '#fff', borderBottomWidth:2, borderBottomWidth:2 , borderBottomColor: menuBelanja ? '#32793D':'#fff'}}
                            onPress={this.handleMenuTambah}>
                                <Text style={{fontWeight:'bold', fontFamily:'Manrope', fontSize:16, color : menuBelanja? '#75BB7F' : '#3B9F45'}}>Tambah Menu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{borderTopRightRadius :15,width:155, height:50, justifyContent:'center', alignItems:'center', backgroundColor: menuBelanja ? '#fff' : '#32793D', borderBottomWidth:2 , borderBottomColor: menuBelanja ? '#fff':'#32793D'}}
                            onPress={this.handleMenuBelanja}>
                                <Text style={{fontWeight:'bold', fontFamily:'Manrope', fontSize:16,color : menuBelanja? '#3B9F45' : '#75BB7F' }}>Menu Belanja</Text>
                            </TouchableOpacity>
                        </View>
                        {menuBelanja == true ?
                            <View style={{borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                                <View style={{width:310, height:90,backgroundColor :'#FFF',padding:10, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                                <View>
                                    <View style={{flex:1}}>
                                        <Text style={{color:'#3B9F45', fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center'}}>Keterangan Belanja</Text>
                                        <View style={{width:250, height:2, backgroundColor:'#3B9F45', marginVertical:3}}/>
                                    </View>
                                    <TextInput 
                                        value={this.state.namaBelanja}
                                        onChangeText={text => this.setState({namaBelanja: text})}
                                        placeholderTextColor={'#95D59B'}
                                        placeholder='Masukkan Keterangan Belanja'
                                        style={{marginHorizontal: 10, backgroundColor :'#FFF', flex:1, borderRadius:5, fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center',color:'#2B6E35', paddingVertical:5}}
                                        maxLength={20}/>
                                </View>
                            </View>
                            <View>
                                <View> 
                                    <TextInput 
                                        value={this.state.totalBelanja}
                                        onChangeText={this.handleInputBelanjaChange} 
                                        placeholderTextColor={'#95D59B'}
                                        keyboardType='numeric'
                                        placeholder='Masukkan Total Belanja'
                                        textAlign='center'
                                        style={{marginTop: 10, marginHorizontal: 10, borderRadius: 3, backgroundColor :'#FFF', width:310, borderRadius:10, fontFamily:'Manrope', fontSize:16, fontWeight:'bold', color:'#2B6E35'}}
                                        />
                                </View>
                            </View>
                            <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}> 
                            </View>
                            <View style={{ width:300, paddingTop:15}}>
                                <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                                    <TouchableOpacity style={{backgroundColor :'#FFF', width:90, height:45,padding:10, borderRadius:20, alignItems:'center'}}
                                    onPress={()=> this.setState({tambahMenuBaru : false})}>
                                        <Text style={{color:'#2B6E35', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{backgroundColor :'#2B6E35', width:90, height:45,padding:10, borderRadius:20, alignItems:'center', marginLeft:15}}
                                    onPress={this.handleLanjutkan}>
                                        <Text style={{color:'#FFF', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </View>
                            :
                            <View style={{borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                                <View style={{width:310, height:90,backgroundColor :'#FFF',padding:10, alignItems:'center', flexDirection:'row'}}>
                                <TouchableOpacity style={{height:72,width:72, justifyContent:'center',alignItems:'center', position:'relative', borderWidth:2, borderRadius:10, borderColor:'#3B9F45'}}
                                onPress={this.openImagePicker}>
                                    <Icon
                                        name="plus"
                                        size={25}
                                        color = '#3B9F45'
                                    />
                                    {this.state.imageUri && (
                                    <Image source={{ uri: this.state.imageUri }} style={{ width: 60, height: 60, borderRadius: 5, marginLeft:10, position:'absolute' }} />
                                    )}
                                </TouchableOpacity>
                                <View style={{marginLeft:10}}>
                                    <View style={{flex:1}}>
                                        <Text style={{color:'#3B9F45', fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center'}}>Nama Menu</Text>
                                        <View style={{width:200, height:2, backgroundColor:'#3B9F45', marginVertical:3}}/>
                                        <TextInput 
                                        value={this.state.namaMenu}
                                        onChangeText={text => {
                                            if (text.length <= 20) {
                                            this.setState({ namaMenu: text });
                                            }
                                        }}
                                        placeholderTextColor={'#95D59B'}
                                        placeholder='Masukkan Nama Menu'
                                        style={{marginHorizontal: 10, backgroundColor :'#FFF', flex:1, borderRadius:5, fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center',color:'#2B6E35', paddingVertical:5}}
                                        maxLength={20}/>
                                    </View>
                                    
                                </View>
                            </View>
                            <View>
                                <View> 
                                    <TextInput 
                                        value={this.state.harga}
                                        onChangeText={this.handleInputChange} 
                                        placeholderTextColor={'#95D59B'}
                                        keyboardType='numeric'
                                        placeholder='Masukkan Harga Menu'
                                        textAlign='center'
                                        style={{marginTop: 10, marginHorizontal: 10, borderRadius: 3, backgroundColor :'#FFF', width:310, borderRadius:10, fontFamily:'Manrope', fontSize:16, fontWeight:'bold', color:'#2B6E35'}}
                                        />
                                </View>
                            </View>
                            <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}> 
                            </View>
                            <View style={{ width:300, paddingTop:15}}>
                                <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                                    <TouchableOpacity style={{backgroundColor :'#FFF', width:90, height:45,padding:10, borderRadius:20, alignItems:'center'}}
                                    onPress={()=> this.setState({tambahMenuBaru : false})}>
                                        <Text style={{color:'#2B6E35', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Batal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{backgroundColor :'#2B6E35', width:90, height:45,padding:10, borderRadius:20, alignItems:'center', marginLeft:15}}
                                    onPress={()=> this.setState(this.tambahMenu())}>
                                        <Text style={{color:'#FFF', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </View>
                        }
                    </View>
                </Modal>
                {/* Modal edit Menu */}
                <Modal isVisible={this.state.editMenu}>
                        <View style={{height:250, borderRadius:20, justifyContent:'center', alignItems:'center', backgroundColor:'#3B9F45'}}>
                    <View style={{borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                                <View style={{width:310, height:90,backgroundColor :'#FFF',padding:10, alignItems:'center', flexDirection:'row',borderRadius:10}}>
                                {selectedItem && (
                                    <TouchableOpacity
                                        style={{ height: 72, width: 72, justifyContent: 'center', alignItems: 'center', position: 'relative', borderWidth: 2, borderRadius: 10, borderColor: '#3B9F45' }}
                                        onPress={this.openImagePicker}
                                    >
                                        {selectedItem.imageUri ? (
                                        <Image source={{ uri: selectedItem.imageUri }} style={{ width: 60, height: 60, borderRadius: 5 }} />
                                        ) : (
                                        <Icon name="plus" size={25} color="#3B9F45" />
                                        )}
                                    </TouchableOpacity>
                                )}
                                <View style={{marginLeft:10}}>
                                    <View style={{flex:1}}>
                                        <Text style={{color:'#3B9F45', fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center'}}>Nama Menu</Text>
                                        <View style={{width:200, height:2, backgroundColor:'#3B9F45', marginVertical:3}}/>
                                        <TextInput 
                                        value={selectedItem && selectedItem.namaMenu}
                                        onChangeText={(text) => {
                                        this.setState((prevState) => ({
                                        selectedItem: { ...prevState.selectedItem, namaMenu: text },
                                        }));
                                        }}
                                        placeholderTextColor={'#95D59B'}
                                        placeholder='Masukkan Nama Menu'
                                        style={{marginHorizontal: 10, backgroundColor :'#FFF', flex:1, borderRadius:5, fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center',color:'#2B6E35', paddingVertical:5}}
                                        maxLength={20}/>
                                    </View>
                                    
                                </View>
                            </View>
                            <View>
                                <View> 
                                    <TextInput 
                                        value={selectedItem && selectedItem.harga}
                                        onChangeText={(text) => {
                                        if (/^\d*$/.test(text)) { // Hanya memperbarui state jika input hanya terdiri dari angka
                                            this.setState((prevState) => ({
                                            selectedItem: { ...prevState.selectedItem, harga: text },
                                            }));
                                        }
                                        }}
                                        placeholderTextColor={'#95D59B'}
                                        keyboardType='numeric'
                                        placeholder='Masukkan Harga Menu'
                                        textAlign='center'
                                        style={{marginTop: 10, marginHorizontal: 10, borderRadius: 3, backgroundColor :'#FFF', width:310, borderRadius:10, fontFamily:'Manrope', fontSize:16, fontWeight:'bold', color:'#2B6E35'}}
                                        />
                                </View>
                            </View>
                            <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}> 
                            </View>
                            <View style={{ width:300, paddingTop:15}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <TouchableOpacity style={{backgroundColor :'#FF6C6C', width:120, height:45,padding:10, borderRadius:20, alignItems:'center'}}
                                    onPress={this.deleteMenu}>
                                        <Text style={{color:'#fff', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Hapus</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={{backgroundColor :'#2B6E35', width:120, height:45,padding:10, borderRadius:20, alignItems:'center', marginLeft:15}}
                                    onPress={this.editMenu}>
                                        <Text style={{color:'#FFF', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </View>
                            </View>
                </Modal>
                </View> 
            </View>
        </SafeAreaView>
        
        );
    }
}
export default Bisnis;