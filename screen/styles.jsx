import {
    StyleSheet,
    Dimensions
} from "react-native";

var height = Dimensions.get("window").height
var width = Dimensions.get('window').width
const styles = StyleSheet.create({
    // NAVBAR STYLE
    bg: {
        backgroundColor: '#D3F4D6',
        flex: 1,
        height: height * 1
    },
    navContainer: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#D3F4D6',
        height: height * 0.1,
    },
    navContainerProfile: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#37A048',
        height: height * 0.1,
        borderBottomRightRadius : 20,
        borderBottomLeftRadius : 20
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10},

    iconNavbar: {
        borderColor: '#3B9F45',
        borderRadius: 20,
        height: 40,
        width: 40,
    },
    navBarText: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: 'Manrope',
        fontWeight: 700,
        color: '#3B9F45'
    },
    // HERO STYLE
    heroCont1: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 25,
        paddingHorizontal: 15,
    },
    heroCont2: {
        height: width *0.3,
        width: width*0.9,
        borderWidth: 3,
        borderColor: '#3B9F45',
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        fontFamily: 'Manrope',
        alignItems: 'center',
    },
    heroCont3: {
        paddingHorizontal: 30,
        fontWeight: 600,
        fontSize: 14,
    },
    textHero: {
        fontWeight: 700,
        fontSize: 36,
        color: '#3B9F45'
    },
    showInfo: {
        height: width*0.09,
        width: width *0.65,
        backgroundColor: '#3B9F45',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    modalTotalCont: {
        height: 200,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#3B9F45',
        position: 'relative'
    },
    bulanCont: {
        width: 300,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#BDFACB',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 25
    },
    bulanFont: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3B9F45',
        fontFamily: 'Manrope'
    },
    totalUangCont: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        height: 95,
        width: 300,
        borderWidth: 1,
        borderColor: '#BDFACB',
        backgroundColor: '#FFF',
        borderRadius: 15
    },
    closeInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#fff',
        borderRadius: 20
    },
    // MENU
    menuContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        elevation: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
    },
    datePicker: {
        height: width*0.13,
        width: width*0.9,
        borderWidth: 3,
        borderRadius: 20,
        borderColor: '#3B9F45',
        backgroundColor: '#FFF',
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tanggalCont: {
        width: width*0.19,
        height: width*0.19,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 2.5
    },
    menuItem: {
        borderWidth: 3,
        width: width*0.89,
        height: width*0.252,
        borderRadius: 20,
        borderColor: '#3B9F45',
        backgroundColor: '#3B9F45',
        marginBottom: 15,
        elevation: 5,
    },
    menuItemTrans: {
        borderWidth: 3,
        width: 360,
        height: 90,
        borderRadius: 20,
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    textMenuItem: {
        color: '#3B9F45',
        fontSize: 25,
        fontFamily: 'Manrope',
        fontWeight: 800,
        lineHeight: 34,
    },
    // NAVBAR BAWAH
    navBawahContain: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 3,
        borderColor: '#3B9F45'
    },
    navBawahContain2: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 20,
        position: 'relative'
    },
    plus: {
        position: 'absolute',
        top: '-70%',
        backgroundColor: 'white',
        left: '46.5%',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        elevation: 2
    },
    // MODAL ADD
    textUangInput: {
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: '#FFF',
        width: 300,
        borderRadius: 20,
        fontFamily: 'Manrope',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2B6E35'
    },
    textKeteranganInput: {
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: '#FFF',
        width: 300,
        borderRadius: 20,
        fontWeight: 'bold',
        fontFamily: 'Manrope',
        fontSize: 16,
        textAlign: 'center',
        color: '#2B6E35',
        paddingVertical: 5
    },
})

export default styles;