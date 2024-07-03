import Colors from "./Colors";
import { StyleSheet } from "react-native";

export const defaultStyles = StyleSheet.create({
    block:{
        backgroundColor:'#ffffff',
        borderRadius:10,
        marginHorizontal:14,
        marginTop:20
    },
    item:{
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        gap:10
    },
    disclamer:{
        textAlign:'center',
        color:Colors.gray,
        marginVertical:20
    },
    separator:{
        height:StyleSheet.hairlineWidth,
        backgroundColor: Colors.lightgray,
        marginLeft:50
    }
});