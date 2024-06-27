import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import welcomeImage from "@/assets/images/home3.jpg";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const Page = () => {

    const openLink = () =>{
        Linking.openURL('https://google.com')
    }
    return(
        <View style={styles.container}>
            <Image source={{uri:welcome_image}} style={styles.welcome}  />
            <Text style={styles.headline}>Welcome to Whats UP</Text>
            <Text style={styles.description}>Read our{' '}<Text style={styles.link} onPress={openLink}>
            Privacy Policy    
            </Text>
            . {'Tap "Agree & Continue" to accept the '}
            <Text style={styles.link} onPress={openLink}>
                Terms of Service
            </Text>
            .
            </Text>
            <Link href={"/otp"} replace asChild>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>
                 Agree & Continue
                </Text>
            </TouchableOpacity>
            </Link>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
container:{
    flex:1,
    padding:20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f2f2f2'
},
welcome:{
    width:250,
    height:250,
    borderRadius:200,
},
headline:{
    fontSize:24,
    marginTop:30,
    marginBottom:15,
    fontWeight:'bold'
},
description:{
fontSize:14,
textAlign:'center',
marginBottom:40
},
link:{
    color:Colors.royalblue,
},
button:{
    width:'55%',
    alignItems:'center',
    backgroundColor:Colors.green,
    paddingVertical:20
},
buttonText:{
    fontSize:16,
    color:'#fff'
}
})