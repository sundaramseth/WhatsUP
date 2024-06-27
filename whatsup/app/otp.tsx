import Colors from "@/constants/Colors";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Linking, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaskInput from 'react-native-mask-input';
import { isClerkAPIResponseError, useSignIn, useSignUp } from "@clerk/clerk-expo";

const Page = () => {
    const [loading, setLoading] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const router = useRouter()
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

    const { bottom } = useSafeAreaInsets()

    const {signUp, setActive} = useSignUp();
    const {signIn} = useSignIn()

    const openLink = () =>{
        Linking.openURL('https://google.com')
    }

    const sendOTP = async () =>{
        setLoading(true);
        try{
            await signUp!.create({
                phoneNumber
            });

            signUp!.preparePhoneNumberVerification();

            router.push(`/verify/${phoneNumber}`);

        }catch(err){
            console.log(err);
            if(isClerkAPIResponseError(err)){
                if(err.errors[0].code === 'form_identifier_exists'){
                    console.log('user exists');
                    await trySignIn();
                }
                else{
                    setLoading(false);
                    Alert.alert('Error', err.errors[0].message);
                }
            }
        }
    };

    const trySignIn = async () =>{

        const {supportedFirstFactors} = await signIn!.create({
            identifier:phoneNumber
        })

        const firstPhoneFactor: any = supportedFirstFactors.find((factor:any)=>{
            return factor.strategy === 'phone_code';
        })

        const {phoneNumberId} = firstPhoneFactor;

        await signIn!.prepareFirstFactor({
            strategy:'phone_code',
            phoneNumberId
        });

        router.push(`/verify/${phoneNumber}?signin=true`);
        setLoading(false);
    }

const IND_MASK = ['+', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,/\d/]


    return(
   <KeyboardAvoidingView style={{flex:1}}>
    <View style={styles.container}>
        {loading && <View style={[StyleSheet.absoluteFill, styles.loading]}>
        <ActivityIndicator size={"large"} color={Colors.primary} />
        <Text style={{marginTop:10, fontSize:16, padding:10}}>Sending Code...</Text>    
        </View>}
        <Text style={styles.description}>
            WhatsUP need to verify your account, Carrier changes may apply
        </Text>
        <View style={styles.list}>
            <View style={styles.listItem}>
                <Text style={styles.listItemText}>India</Text>
                 <Icon name="chevron-right" size={15} color={Colors.primary} />
            </View>
            <View style={styles.separator} />

            <MaskInput
            style={styles.input}
            value={phoneNumber}
            keyboardType="numeric"
            autoFocus
            placeholder="+91 enter phone number"
            onChangeText={(masked, unmasked) => {
                setPhoneNumber(masked);
            }}
            mask={IND_MASK}
            />

        </View>
        <Text style={styles.legal}>
            You must be{' '}
            <Text style={styles.link}>
            at least 16 years old
            </Text>{' '}
            to register. Learn how WhatsUp works with the{' '}
            <Text style={styles.link} onPress={openLink}>
                your information. 
            </Text>
        </Text>

        <View style={{flex:1}}></View>

        <TouchableOpacity onPress={sendOTP} 
        disabled={phoneNumber === ''}
        style={[styles.nextButton, phoneNumber !== '' ? styles.enabled: null, {marginBottom:bottom}]}>
        <Text style={[styles.buttonText, phoneNumber !== null?styles.enableButtonText:null]}>
            Next
        </Text>
        </TouchableOpacity> 
    </View>
   </KeyboardAvoidingView>
    )
}

export default Page;

const styles = StyleSheet.create({
container:{
    flex:1,
    alignItems:'center',
    padding:20,
    backgroundColor: Colors.whitesmoke,
    gap:20
},
description:{
    fontSize:14,
    marginBottom:20,
    textAlign:'left'
    },
    list:{
        backgroundColor:'#fff',
        width:'100%',
        borderRadius:10,
        padding:5,
        verticalAlign:'middle'
    },
    listItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:6,
        color:'#000',
        fontSize:16
    },
    listItemText:{
        fontSize:16,
        marginVertical:10,
        color:Colors.primary
    },
    separator:{
        height:StyleSheet.hairlineWidth,
        backgroundColor: Colors.gray,
        opacity:0.2,
        width:'100%'
    },
    legal:{
        fontSize:12,
        textAlign:'center',
        color:'#000'
    },
    link:{
        color:Colors.primary
    },
    nextButton:{
        backgroundColor:Colors.lightgray,
        fontSize:16,
        paddingVertical:12,
        width:'100%',
        alignItems:'center'
    },
    enabled:{
        backgroundColor:Colors.primary,
    },
    buttonText:{
        color:Colors.gray
    },
    enableButtonText:{
        color:'#fff'
    },
    input:{
        backgroundColor:'#fff',
        width:'100%',
        fontSize:16,
        padding:6,
        marginTop:10
    },
    loading:{
        ...StyleSheet.absoluteFillObject,
        zIndex:10,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center'
    }

})