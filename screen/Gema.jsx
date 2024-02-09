import React from 'react';
import {Text, View, StatusBar, TouchableOpacity, TextInput, ScrollView, Image,Dimensions, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Modal from "react-native-modal";
import styles from './styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage'
import NavigationProfile from './NavigationProfile';
import NavigationName from './NavigationName';

class HomeGema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tambahNote: false,
            uang: 0,
            pilihanYangDiseleksi: false,
            iconMasuk: false,
            uangMasuk: 0,
            uangKeluar: 0,
            showDatePicker: false,
            date: new Date(),
            selectedDate:new Date().toISOString(),
            selectedDateMilih : '',
            filteredData: [],
            showTotalUang: false,
            totalUang: 0,
            isProfileMenuActive: false,
            hariIni : new Date(),
            showActions: false, // State untuk menampilkan atau menyembunyikan kotak tindakan
            selectedItem: null, 
            refreshPage : false,
            keterangan : '',
        };
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

    tambahData = () => {
        let data = this.state.data;
        let uang = parseFloat(this.state.uang);
        let currentTime = new Date().toISOString();
        const selectedDate = this.state.selectedDate;

        const dateObj = new Date(selectedDate);
        const tanggalCus = this.showFormattedDate(dateObj);
        const bulanCus = this.showFormattedMonth(dateObj);
        const tahunCus = this.showFormattedYear(dateObj);
      
        if (this.state.pilihanYangDiseleksi) {
          this.setState(prevState => ({
            uangMasuk: prevState.uangMasuk + uang
          }));
        } else {
          this.setState(prevState => ({
            uangKeluar: prevState.uangKeluar + uang
          }));
        }

        const newEntry = {
          id: +new Date(),
          uang: this.state.uang,
          keterangan: this.state.keterangan,
          iconMasuk: this.state.iconMasuk,
          tanggalCus: tanggalCus,
          bulanCus: bulanCus,
          tahunCus: tahunCus,
          waktuIso: selectedDate,
          timeAll: this.showFormattedAllDate(selectedDate),
        };
    
        data.push(newEntry);
      
        const { uangMasuk, uangKeluar, totalUang } = this.calculateTotalUang(data);
      
        this.saveDataToAsyncStorage();
        AsyncStorage.setItem('data', JSON.stringify(data))
          .then(() => {
            AsyncStorage.setItem('totalUang', totalUang.toString())
              .then(() => {
                AsyncStorage.setItem('uangMasuk', uangMasuk.toString())
                  .then(() => {
                    AsyncStorage.setItem('uangKeluar', uangKeluar.toString())
                      .then(() => {
                        this.setState(
                          {
                            data,
                            uang,
                            keterangan: '',
                            tambahNote: false,
                            pilihanYangDiseleksi: false,
                            iconMasuk: false,
                            uangMasuk,
                            uangKeluar,
                            totalUang,
                            filteredData: [newEntry, ...this.state.filteredData]
                          },
                          () => {
                            // State berhasil disimpan ke AsyncStorage
                            this.filterDataByDate();
                          }
                        );
                      })
                      .catch(error => {
                        console.log('Error storing uangKeluar: ', error);
                      });
                  })
                  .catch(error => {
                    console.log('Error storing uangMasuk: ', error);
                  });
              })
              .catch(error => {
                console.log('Error storing total uang: ', error);
              });
          })
          .catch(error => {
            console.log('Error storing data: ', error);
          });
        this.setState({ tambahData: false });
      };

    componentDidMount() {
        this.getDataFromAsyncStorage()
    }

      getDataFromAsyncStorage = async () => {
        try {
          const data = await AsyncStorage.getItem('data');
          const uangMasuk = await AsyncStorage.getItem('uangMasuk');
          const uangKeluar = await AsyncStorage.getItem('uangKeluar');
          const totalUang = await AsyncStorage.getItem('totalUang');
      
          if (data !== null && uangMasuk !== null && uangKeluar !== null && totalUang !== null) {
            this.setState(
              {
                data: JSON.parse(data),
                uangMasuk: parseFloat(uangMasuk),
                uangKeluar: parseFloat(uangKeluar),
                totalUang: parseFloat(totalUang),
              },
              () => {
                this.filterDataByDate(); // Memanggil fungsi filterDataByDate untuk memperbarui filteredData saat aplikasi dimuat kembali
              }
            );
          }
        } catch (error) {
          console.log('Error retrieving data from AsyncStorage:', error);
        }
      };
      

    showDatePicker = () => {
        this.setState({ showDatePicker: true });
    };
    
    hideDatePicker = () => {
        this.setState({ showDatePicker: false });
    };
    
    handleDateChange = selectedDate => {
        if (selectedDate) {
          const formattedDate = selectedDate.toISOString(); // Mengubah tanggal menjadi format ISO
          this.setState({ selectedDate: formattedDate, date: selectedDate }, () => {
            this.filterDataByDate(); // Pemfilteran otomatis setelah mengubah tanggal
          });
        }
        this.hideDatePicker();
      };

    
    saveDataToAsyncStorage = async () => {
        try {
            const data = await AsyncStorage.getItem('data');
            const uangMasuk = await AsyncStorage.getItem('uangMasuk');
            const uangKeluar = await AsyncStorage.getItem('uangKeluar');
            const totalUang = await AsyncStorage.getItem('totalUang');
        
            if (data !== null) {
              this.setState({ 
                data: JSON.parse(data),
                uangMasuk: parseFloat(uangMasuk),
                uangKeluar: parseFloat(uangKeluar), 
                totalUang: parseFloat(totalUang),
              }, () => {
                this.filterDataByDate();
              });
            }
          } catch (error) {
            console.log('Error retrieving data from AsyncStorage:', error);
          }
    };
    
    handleMasukPress = () => {
        this.setState({
            pilihanYangDiseleksi: true,
            iconMasuk: true,
        });
    };
    
    handleKeluarPress = () => {
        this.setState({
        pilihanYangDiseleksi: false,
        iconMasuk: false
        });
    };
    
    calculateTotalUang = (data) => {
        let uangMasuk = 0;
        let uangKeluar = 0;
    
        data.forEach(item => {
            if (item.iconMasuk) {
                uangMasuk += parseFloat(item.uang); // Menggunakan parseFloat untuk mengonversi string ke angka
            } else {
                uangKeluar += parseFloat(item.uang); // Menggunakan parseFloat untuk mengonversi string ke angka
            }
        });
    
        const totalUang = uangMasuk - uangKeluar;
        return { uangMasuk, uangKeluar, totalUang };
    };
    

    toggleProfileMenu = () => {
        this.setState(prevState => ({
            isProfileMenuActive: !prevState.isProfileMenuActive,
        }));
    };

    handleInputChange = (text) => {
        // Hanya memperbarui state jika input hanya terdiri dari angka
        if (/^\d*$/.test(text)) {
            this.setState({ uang: text });
        }
    };

    // Fungsi untuk menampilkan kotak tindakan saat item diklik
    handleItemPress = (item) => {
        this.setState({
        showActions: true,
        selectedItem: item,
        });
    };
    
    // Fungsi untuk menyembunyikan kotak tindakan
    hideActions = () => {
        this.setState({
        showActions: false,
        selectedItem: null,
        });
    };

     // Function to edit the selected item
      handleEditItem = () => {
        const { selectedItem, data } = this.state;
      
        if (selectedItem !== null) {
          const selectedIndex = data.findIndex((item) => item.id === selectedItem.id);
      
          if (selectedIndex !== -1) {
            const updatedData = [...data];
            updatedData[selectedIndex] = {
              ...selectedItem,
              uang: parseFloat(selectedItem.uang),
              keterangan: selectedItem.keterangan,
              iconMasuk: selectedItem.iconMasuk,
            };
      
            const { uangMasuk, uangKeluar, totalUang } = this.calculateTotalUang(updatedData);
      
            AsyncStorage.setItem('data', JSON.stringify(updatedData))
              .then(() => {
                AsyncStorage.setItem('uangMasuk', uangMasuk.toString())
                  .then(() => {
                    AsyncStorage.setItem('uangKeluar', uangKeluar.toString())
                      .then(() => {
                        AsyncStorage.setItem('totalUang', totalUang.toString())
                          .then(() => {
                            // Update filteredData state
                            const { selectedDate } = this.state;
                            let filteredData = [];
                            if (selectedDate.trim() !== '') {
                              filteredData = updatedData.filter((item) => item.timeAll === this.showFormattedAllDate(selectedDate));
                            } else {
                              filteredData = updatedData;
                            }
      
                            this.setState(
                              {
                                data: updatedData,
                                uangMasuk,
                                uangKeluar,
                                totalUang,
                                selectedItem: null,
                                showActions: false,
                                filteredData,
                              },
                              () => {
                                this.saveDataToAsyncStorage();
                              }
                            );
                          })
                          .catch((error) => {
                            console.log('Error saving total balance:', error);
                          });
                      })
                      .catch((error) => {
                        console.log('Error saving expenses:', error);
                      });
                  })
                  .catch((error) => {
                    console.log('Error saving income:', error);
                  });
              })
              .catch((error) => {
                console.log('Error saving data:', error);
              });
          }
        }
      };

      hapusItem = () => {
        const { selectedItem, data } = this.state;
      
        if (selectedItem !== null) {
          const updatedData = data.filter((item) => item.id !== selectedItem.id);
      
          const { uangMasuk, uangKeluar, totalUang } = this.calculateTotalUang(updatedData);
      
          AsyncStorage.setItem('data', JSON.stringify(updatedData))
            .then(() => {
              AsyncStorage.setItem('uangMasuk', uangMasuk.toString())
                .then(() => {
                  AsyncStorage.setItem('uangKeluar', uangKeluar.toString())
                    .then(() => {
                      AsyncStorage.setItem('totalUang', totalUang.toString())
                        .then(() => {
                          console.log('Item deleted successfully');
      
                          // Update filteredData state
                          const { selectedDate } = this.state;
                          let filteredData = [];
                          if (selectedDate.trim() !== '') {
                            filteredData = updatedData.filter((item) => item.timeAll === this.showFormattedAllDate(selectedDate));
                          } else {
                            filteredData = updatedData;
                          }
      
                          // Set the state with updated data and filteredData
                          this.setState(
                            {
                              data: updatedData,
                              uangMasuk,
                              uangKeluar,
                              totalUang,
                              selectedItem: null,
                              showActions: false,
                              filteredData,
                            },
                            () => {
                              this.saveDataToAsyncStorage();
                            }
                          );
                        })
                        .catch((error) => {
                          console.log('Error saving total balance:', error);
                        });
                    })
                    .catch((error) => {
                      console.log('Error saving expenses:', error);
                    });
                })
                .catch((error) => {
                  console.log('Error saving income:', error);
                });
            })
            .catch((error) => {
              console.log('Error saving data:', error);
            });
        }
      };
      
      

      filterDataByDate = () => {
        const { selectedDate, data } = this.state;
        let filteredData = [];
      
        let currentDate = new Date().toISOString(); // Mengambil tanggal saat ini
        
        if (selectedDate.trim() !== '') {
          currentDate = selectedDate;
        }
        
        filteredData = data.filter((item) => {
          const itemDay = item.tanggalCus;
          const itemMonth = item.bulanCus;
          const itemYear = item.tahunCus;
      
          return (
            this.showFormattedDate(currentDate) === itemDay &&
            this.showFormattedMonth(currentDate) === itemMonth &&
            this.showFormattedYear(currentDate) === itemYear
          );
        });
      
        this.setState({ selectedDate: currentDate, filteredData });
      };
      //Dengan perubahan di atas, jika selectedDate tidak kosong, maka currentDate akan diisi dengan nilai selectedDate yang dipilih. Jika selectedDate kosong, maka currentDate akan tetap menggunakan tanggal saat ini menggunakan new Date().toISOString(). Setelah itu, Anda dapat menggunakan currentDate untuk melakukan filter pada data dan memperbarui selectedDate dengan nilai yang telah dipilih.
      formatCurrency = (text) => {
        // Menghapus semua karakter selain angka
        const cleanedText = text.replace(/\D/g, '');
      
        // Memisahkan ribuan dengan titik setiap tiga digit
        let formattedText = cleanedText.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
        // Mengupdate state dengan nilai yang telah diformat
        this.setState({ uang: formattedText });
      }
    render() {
        const { data, pilihanYangDiseleksi, showDatePicker, date, filteredData, showActions, selectedItem} = this.state;
        const formattedDate = moment(date).format('DD MMMM YYYY');
        let currentTimeNow = new Date().toISOString()
        var height = Dimensions.get("window").height
        var width = Dimensions.get('window').width

        //filteredData.sort((a, b) => b.waktuIso.localeCompare(a.waktuIso));

        return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar barStyle="dark-content" backgroundColor={'#D3F4D6'} />
            <View style={styles.navContainer}>
                <View style={styles.navItem}>
                    <TouchableOpacity style={styles.iconNavbar}
                    onPress={()=> this.props.navigation.navigate('Profile')}>
                        <NavigationProfile style={{aspectRatio: 1,borderRadius: 100,borderWidth: 2,borderColor: '#3B9F45',resizeMode: 'contain'}}/>
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
                                        <TouchableOpacity style={styles.showInfo}
                                        onPress={()=> this.setState({showTotalUang : true})}>
                                            <Text style={{fontSize:15, fontWeight:'bold', color :'#FFF'}}>PERSONAL</Text>
                                            <Icon
                                                name = 'info-circle'
                                                size = {15}
                                                color = "#fff"
                                                style={{marginLeft:15}}
                                            /> 
                                        </TouchableOpacity>
                                        {/* MODAL TOTAL */}
                                        <Modal isVisible={this.state.showTotalUang}>  
                                            <View style={styles.modalTotalCont}>
                                                <View style={styles.bulanCont}>
                                                    <Text style={styles.bulanFont}>
                                                        {this.showFormattedYearAndMonth(currentTimeNow)}
                                                    </Text>
                                                </View>
                                                <View style={styles.totalUangCont}>
                                                    <Text style={{paddingVertical:3,fontSize:20, fontFamily:'Manrope', fontWeight:'bold', color:'#3B9F45'}}>Total uang anda : </Text>
                                                    <View style={{borderWidth:0.6, width:250, borderColor:'#77B87D'}}/>
                                                    <Text style={{fontSize:20, fontFamily:'Manrope', fontWeight:'bold', color:'#3B9F45', marginTop:10}}>Rp.{this.state.totalUang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                                </View>
                                                <TouchableOpacity style={styles.closeInfo}
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
                                                <Text style={{marginLeft:10, fontWeight:700,fontSize:15, color:'#3B9F45'}}>Rp.{this.state.uangMasuk.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                                                <Icon
                                                    name="arrow-circle-up"
                                                    size = {25}
                                                    color ="#FF6C6C"
                                                />
                                                <Text style={{marginLeft:10, fontWeight:700,fontSize:15, color:'#3B9F45'}}>Rp.{this.state.uangKeluar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                                            </View>
                                    </View>
                            </View>
                        </View>
                    </View>
                </View>
                {/* MENU */}
                <View style={{alignItems:'center', flex:1}}>
                        <View style={styles.menuContainer}>
                            <View style={{ justifyContent:'center', alignItems:'center', marginBottom:8}}>
                                <TouchableOpacity onPress={this.showDatePicker} style={styles.datePicker}>
                                    {/* <View style={{borderRightWidth: 1, paddingHorizontal: 10}}>
                                        <Text>icon</Text>
                                    </View> */}
                                    {/* <Text style={{fontFamily:'Manrope', fontWeight:700, fontSize:16, lineHeight:20, color:'#3B9F45'}}>{this.showFormattedAllDate(time)}</Text> */}
                                    {/* <View style={{borderLeftWidth:1, paddingHorizontal: 10}}>
                                        <Text>icon</Text>
                                    </View> */}
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
                            </View>
                            <ScrollView>
                                <View style={{justifyContent:'center', alignItems:'center', paddingTop:10}}>
                                    {/* item yg dirender */}
                                    {
                                        filteredData.map((item)=> (
                                            <TouchableOpacity key={item.id}
                                            style={styles.menuItem} onPress={() => this.handleItemPress(item)}>
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
                                                        <Text style={{color:'#FFF', fontFamily:'Manrope', fontWeight:700, fontSize:16, lineHeight:20}}>{item.keterangan.toUpperCase()}</Text>
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
                                                                    Rp.{item.uang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        {/* PLUS */}
                <View style={styles.navBawahContain}>
                    <View style={[styles.navBawahContain2,{display:'flex'}]}>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Bisnis')} style={{width:130, height:35,position:'relative'}}>
                            <Icon
                                name="store"
                                size= {30}
                                color = "#aaa"
                                style={{position :'absolute', left:20}}
                            />
                        </TouchableOpacity>
                        <View underlayColor="white" style={[styles.plus,]}>
                            <TouchableOpacity style={{borderWidth:4, width: 50, height:50 ,justifyContent:'center', alignItems:'center', borderRadius:10, borderColor:'#3B9F45'}}
                            onPress={()=> this.setState({tambahNote : true})}>
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
                                color = "#3B9F45"
                                style={{position :'absolute', right:20}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Modal Add*/}
                <Modal isVisible={this.state.tambahNote}>
                    <View style={{height:400, borderRadius:20, justifyContent:'center', alignItems:'center', backgroundColor:'#3B9F45'}}>
                        <View>
                            <View> 
                                <TextInput 
                                    value={this.state.uang}
                                    onChangeText={this.handleInputChange} 
                                    placeholderTextColor={'#3B9F45'}
                                    keyboardType='numeric'
                                    placeholder='Masukkan jumlah nominal'
                                    textAlign='center'
                                    style={styles.textUangInput}
                                    />
                            </View>
                            <View style={{flexDirection:'row', padding:10, justifyContent:'space-between', marginTop:5}}>
                                <TouchableOpacity style={{ width:135, height:45,padding:10, borderRadius:20, alignItems:'center',borderWidth: pilihanYangDiseleksi ? 0 : 2,borderColor :'#BDFACB',backgroundColor: pilihanYangDiseleksi ? '#FFF' : '#2B6E35'}}
                                onPress={this.handleKeluarPress}>
                                    <Text style={{color: pilihanYangDiseleksi ? '#3B9F45' : '#FFF', fontFamily: 'Manrope', fontSize: 16, fontWeight: 'bold'}}>Keluar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{borderWidth: pilihanYangDiseleksi ? 2 : 0,borderColor: '#BDFACB',backgroundColor: pilihanYangDiseleksi ? '#2B6E35' : '#FFF', width:135, height:45,padding:10, borderRadius:20, alignItems:'center'}}
                                onPress={this.handleMasukPress}>
                                    <Text style={{color: pilihanYangDiseleksi ? '#FFF' : '#3B9F45', fontFamily: 'Manrope', fontSize: 16, fontWeight: 'bold'}}>Masuk</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.showDatePicker} style={[styles.datePicker, {width:300}]}>
                                    {/* <View style={{borderRightWidth: 1, paddingHorizontal: 10}}>
                                        <Text>icon</Text>
                                    </View> */}
                                    {/* <Text style={{fontFamily:'Manrope', fontWeight:700, fontSize:16, lineHeight:20, color:'#3B9F45'}}>{this.showFormattedAllDate(time)}</Text> */}
                                    {/* <View style={{borderLeftWidth:1, paddingHorizontal: 10}}>
                                        <Text>icon</Text>
                                    </View> */}
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
                        <View style={{width:300, height:90,backgroundColor :'#FFF',padding:10, borderRadius:20, marginTop:5, alignItems:'center'}}>
                            <View>
                                <Text style={{color:'#3B9F45', fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center'}}>Keterangan</Text>
                                <View style={{width:210, height:2, backgroundColor:'#3B9F45', marginVertical:3}}/>
                            </View>
                            <TextInput 
                                    value={this.state.keterangan}
                                    onChangeText={text => this.setState({keterangan: text})}
                                    placeholderTextColor={'#3B9F45'}
                                    placeholder='Masukkan keterangan'
                                    textAlign='center'
                                    style={styles.textKeteranganInput}
                                    maxLength={20}
                                    />
                        </View>
                        <View style={{ width:300, paddingTop:15}}>
                        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{backgroundColor :'#FFF', width:90, height:45,padding:10, borderRadius:20, alignItems:'center'}}
                            onPress={()=> this.setState({tambahNote : false})}>
                                <Text style={{color:'#2B6E35', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor :'#2B6E35', width:90, height:45,padding:10, borderRadius:20, alignItems:'center', marginLeft:15}}
                            onPress={()=> this.setState(this.tambahData())}>
                                <Text style={{color:'#FFF', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </Modal>
                {/* MODAL EDIT */}
                <Modal isVisible={this.state.showActions}>
                    <View style={{height:300, borderRadius:20, justifyContent:'center', alignItems:'center', backgroundColor:'#3B9F45'}}>
                        <View>
                            <View> 
                                <TextInput 
                                    value={selectedItem && selectedItem.uang.toString()}
                                    onChangeText={(text) => {
                                        this.setState((prevState) => ({
                                        selectedItem: { ...prevState.selectedItem, uang: text },
                                        }));
                                    }}
                                    placeholderTextColor={'#3B9F45'}
                                    keyboardType='numeric'
                                    placeholder='Masukkan jumlah nominal'
                                    textAlign='center'
                                    style={styles.textUangInput}
                                    />
                            </View>
                        </View>
                        <View style={{width:300, height:90,backgroundColor :'#FFF',padding:10, borderRadius:20, marginTop:5, alignItems:'center'}}>
                            <View>
                                <Text style={{color:'#3B9F45', fontWeight:'bold', fontFamily:'Manrope', fontSize:16, textAlign:'center'}}>Keterangan</Text>
                                <View style={{width:210, height:2, backgroundColor:'#3B9F45', marginVertical:3}}/>
                            </View>
                            <TextInput 
                                    value={selectedItem && selectedItem.keterangan}
                                    onChangeText={(text) => {
                                        this.setState((prevState) => ({
                                        selectedItem: { ...prevState.selectedItem, keterangan: text },
                                        }));
                                    }}
                                    placeholderTextColor={'#3B9F45'}
                                    placeholder='Masukkan keterangan'
                                    textAlign='center'
                                    style={styles.textKeteranganInput}
                                    maxLength={20}/>
                        </View>
                        <View style={{ width:300, paddingTop:15}}>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <TouchableOpacity style={{backgroundColor :'#FF6C6C', width:120, height:45,padding:10, borderRadius:20, alignItems:'center'}}
                            onPress={this.hapusItem}>
                                <Text style={{color:'#FFf', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Hapus</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor :'#2B6E35', width:120, height:45,padding:10, borderRadius:20, alignItems:'center', marginLeft:15}}
                            onPress={this.handleEditItem}>
                                <Text style={{color:'#FFF', fontFamily:'Manrope', fontSize:16, fontWeight:'bold'}}>Simpan</Text>
                            </TouchableOpacity>
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
export default HomeGema;