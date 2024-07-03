import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useSegments } from 'expo-router';
import { TouchableOpacity,  } from 'react-native';
import { View, Image, Text } from 'react-native';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chats",
          headerLargeTitle: true,
          headerTransparent:true,
          headerBlurEffect:'regular',
          headerSearchBarOptions: {
            placeholder: 'Search',
          },
          headerStyle:{
            backgroundColor:'#fff'
          },
          headerRight: () => (
            <View style={{flexDirection:'row', gap:20}}>
            <TouchableOpacity>
              <Ionicons name="camera-outline" color={Colors.primary} size={25} />
            </TouchableOpacity>

            <Link href="/(modals)/new-chat" asChild>
            <TouchableOpacity>
              <Ionicons name="add-circle" color={Colors.primary} size={25} />
            </TouchableOpacity>
            </Link>

            <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal-circle-outline" size={25}/>
            </TouchableOpacity>

            </View>
           
          ),
        }}
      />
          <Stack.Screen name='[id]' options={{
           title:'',
           headerBackTitleVisible:false,
           headerRight:()=>(
                <View style={{flexDirection:'row', gap:30}}>
                <TouchableOpacity>
                <Ionicons name="videocam-outline" color={Colors.primary} size={25} />
                </TouchableOpacity>
                <TouchableOpacity>
                <Ionicons name="call-outline" color={Colors.primary} size={25} />
                </TouchableOpacity>
                </View>
           ),
           headerTitle:()=>(
                <View style={{flexDirection:'row', gap:10, paddingBottom:4, alignItems:'center', width:220}}>
                    <Image
                    source={{uri:'https://i.pravatar.cc/150?u=myrnaduke@marketoid.com'}}
                    style={{width:40, height:40, borderRadius:50, backgroundColor:Colors.gray}} />
                    <Text style={{fontSize:14, fontWeight:500}}>Riya</Text>
                </View>
           ),
           headerStyle:{
            backgroundColor:Colors.background
           }
          }} />
    </Stack>

  );
};
export default Layout;