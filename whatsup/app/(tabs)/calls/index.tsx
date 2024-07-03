import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import moment from 'moment';
import { format } from 'date-fns';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import calls from '@/assets/data/calls.json';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, Feather  } from '@expo/vector-icons';
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { SegmentedControl } from '@/components/SegmentedControl';
import SwipeableRow from '@/components/SwipeableRow';
import * as Haptics from 'expo-haptics';
// const transition = Transition.delay(100);


const AnimatedTochableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Page = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(calls)
  const editing = useSharedValue(-35);
  const [selectedOption, setSelectedOption] = useState('All');



  const onEdit = () => {
    let editingNew = !isEditing;
    editing.value = editingNew ? 0 : -30;
    setIsEditing(editingNew);
  };

  useEffect(()=>{
    console.log('selectedOption',selectedOption);
    if(selectedOption === 'All'){
      setItems(calls);
    }
    else{
        setItems(calls.filter((item)=>item.missed));
      }
    },[selectedOption]);

 
    const removeCall = (item:any) =>{
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setItems(items.filter((i) => i.id !== item.id));
         }

    const animatedRowStyles = useAnimatedStyle(()=>({
    transform:[{translateX:withTiming(editing.value)}]
    }))

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack.Screen
        options={{
          headerTitle:()=>(
            <View style={{position:'absolute', margin:'auto', left:100}}>
            <SegmentedControl options={['All', 'Missed']} selectedOption={selectedOption}
            onOptionPress={setSelectedOption}
            />
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={onEdit}>
              <Text style={{ color: Colors.primary, fontSize: 18, paddingRight:10 }}>
                {isEditing ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingTop:80
        }}
        >
          <Animated.View style={defaultStyles.block} layout={CurvedTransition.delay(100)}>
            <Animated.FlatList
            skipEnteringExitingAnimations
            data={items}
            scrollEnabled={false}
            keyExtractor={(item)=>item.id.toString()}
            ItemSeparatorComponent={()=><View style={defaultStyles.separator} />}
            layout={CurvedTransition}
            renderItem={({item, index})=>(
            <SwipeableRow onDelete={() => removeCall(item)}>
            
            <Animated.View
            style={{flexDirection:'row', alignItems:'center'}}
            entering={FadeInUp.delay(index * 10)} exiting={FadeOutUp}>
            <AnimatedTochableOpacity onPress={()=>removeCall(item)}
            style={[animatedRowStyles,{paddingLeft:8}]}
            >
              <Ionicons name='remove-circle' size={24} color={Colors.red}/>
              
              </AnimatedTochableOpacity>
            <Animated.View style={[defaultStyles.item, animatedRowStyles]}>
             <Image source={{uri:item.img}} style={styles.avatar} />
            
            <View style={{flex:1, gap:2}}>
            <Text style={{fontSize:18, color:item.missed?Colors.red:'#000'}}>
                {item.name}
            </Text>

            <View style={{flexDirection:'row', gap:4}}>
               <Feather name={item.incoming?'arrow-down-left':'arrow-up-right'} color={item.missed?Colors.red:Colors.green}
               size={18}
               />
               <Text style={{fontSize:14, color:Colors.gray}}>
               {format(item.date, 'MMMM-dd/yy')}
               </Text>

            </View>
            </View>
            <View style={{flexDirection:'row', gap:4}}>
              <Ionicons name={item.video?'videocam':'call'}
              size={18}
              color={Colors.gray}
              />
            </View>                  
            </Animated.View>
            </Animated.View>
            </SwipeableRow>
            )}
            />
            </Animated.View>
        
            <View style={{flex:1, marginVertical:10, borderTopWidth:1, borderTopColor:Colors.lightgray }}>
              <Text style={[defaultStyles.disclamer]}>Your personel calls are end-to-end encrypted</Text>
            </View>
      
 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
});
export default Page;