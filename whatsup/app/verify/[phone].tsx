import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

import { View, Text, SafeAreaView, StyleSheet, Platform, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { isClerkAPIResponseError, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { Alert } from "react-native";

const CELL_COUNT = 6;

const Page = () => {
    
    const {phone, signin} = useLocalSearchParams<{phone: string, signin:string}>();
    
    
    const [code, setCode] = useState('');

    const ref = useBlurOnFulfill({value:code, cellCount:CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode
    })

    const {signUp, setActive} = useSignUp();
    const {signIn} = useSignIn();



    useEffect(()=>{
        if(code.length === 6){
           if(signin === 'true'){
            verifySignIn();
           }
           else{
            verifyCode();
           }            //TODO: Verify otp
        }
    },[code]);
    

    const verifyCode = async () =>{
        try{
            await signUp!.attemptPhoneNumberVerification({
                code,
            })

            await setActive!({
                session:signUp!.createdSessionId
            });

        }catch(err){
            console.log('error', JSON.stringify(err, null, 2));
            if(isClerkAPIResponseError(err)){
                Alert.alert("error", err.errors[0].message);
            }

        }

    }

    const verifySignIn = async () => {
        try{

            await signIn!.attemptFirstFactor({
                strategy:'phone_code',
                code,
            });

            await setActive!({session:signIn!.createdSessionId});

        }catch(err){
            console.log('error', JSON.stringify(err,null,2));
            if(isClerkAPIResponseError(err)){
                Alert.alert("error", err.errors[0].message);
            }
        }

    }

    const resendCode = async () => {
        try{
         if(signin === 'true'){
            const {supportedFirstFactors} = await signIn!.create({
                identifier:`${phone}`
            })

            const firstPhoneFactor: any = supportedFirstFactors.find((factor:any)=>{
                return factor.strategy === 'phone_code';
            })

            const {phoneNumberId} = firstPhoneFactor;

            await signIn!.prepareFirstFactor({
                strategy:'phone_code',
                phoneNumberId
            });
         }else{
            await signUp!.create({
                phoneNumber:phone,
            });
            signUp!.preparePhoneNumberVerification();
         }
        }catch(err){
            console.log('error', JSON.stringify(err,null,2));
            if(isClerkAPIResponseError(err)){
                Alert.alert("error", err.errors[0].message);
            }
        }

    }

    return (

<View style={styles.container}>
     <Stack.Screen options={{headerTitle:phone}} />
      <Text style={styles.legal}>We have sent you an SMS with a code to the number above.</Text>
      <Text style={styles.legal}>
        To complete your phone number verification, please enter 6-digit activation code.
      </Text>

      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        // autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
        testID="my-code-input"
        renderCell={({index, symbol, isFocused}) => (
          <View
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
             
             <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor/> : null)}</Text>
          </View>
        )}
      />

<TouchableOpacity style={styles.nextButton} onPress={resendCode}>
    <Text style={styles.buttonText}>Didn't receive a verification code?</Text>
</TouchableOpacity>


    </View>
    )
}

export default Page

const styles = StyleSheet.create({

container:{
        flex:1,
        alignItems:'center',
        padding:20,
        backgroundColor: Colors.whitesmoke,
        gap:20
    },
    legal:{
        fontSize:12,
        textAlign:'center',
        color:'#000'
    },
    nextButton:{
        fontSize:16,
        paddingVertical:12,
        width:'100%',
        alignItems:'center'
    },
    buttonText:{
        color:Colors.primary
    },
    codeFieldRoot: {
        marginTop: 20,
        width:260,
        marginLeft:'auto',
        marginRight:'auto',
        gap:6
    },
    cellRoot: {
        width: 40,
        height: 40,
        justifyContent:'center',
        alignItems:'center',
        fontSize: 24,
        borderBottomColor: '#ccc',
        borderBottomWidth:1
  },
  focusCell: {
        borderColor: '#000',
  },
  cellText:{
        color:'#000',
        fontSize:36,
        textAlign:'center'
  }
  });