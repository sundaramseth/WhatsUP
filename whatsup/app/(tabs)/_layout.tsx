import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useSegments } from "expo-router";
import { GestureHandlerRootView} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from "@/constants/Colors";

const Layout = () =>{

    const segments = useSegments();
    
    return(
    <GestureHandlerRootView style={{ flex: 1 }}>
           <Tabs 
           
           screenOptions={{
            tabBarStyle:{
                backgroundColor:'#f2f2f2'
            },
            tabBarActiveTintColor:Colors.primary,
            tabBarInactiveBackgroundColor:'#f2f2f2',
            tabBarActiveBackgroundColor:'#f2f2f2',
            headerStyle:{
                backgroundColor:'#f9f9f9'
            },
            headerShadowVisible:false
           }}
           >
            <Tabs.Screen 
            name="updates" 
            options={{
                title:'Updates',
                tabBarIcon:({size,color})=>(
                    <Icon name="refresh" size={size} color={color}  />
                )
            }}
            />
 

           <Tabs.Screen 
        name="communities" 
            options={{
                title:'Communities',
                tabBarIcon:({size,color})=>
                    <Icon name="group" size={size} color={color}  />
            }}
            />

            
           <Tabs.Screen 
           name="chats" 
            options={{
                title:'Chats',
                headerShown:false,
                tabBarIcon:({size,color})=> (
                    <Icon name="comment" size={size} color={color}  />
                ),
                tabBarStyle:{
                    backgroundColor:Colors.background,
                    display: segments[2] === '[id]'?'none':'flex'
                }
            }}
            />

          <Tabs.Screen 
           name="calls" 
            options={{
                title:'Calls',
                headerShown:false,
                tabBarIcon:({size,color})=>
                    <Icon name="phone" size={size} color={color}  />
            }}
            />

                 
           <Tabs.Screen 
           name="settings" 
            options={{
                title:'Settings',
                headerShown:false,
                tabBarIcon:({size,color})=>
                    <Icon name="cog" size={size} color={color}  />
            }}
            />

           </Tabs>
    </GestureHandlerRootView>
    );
}

export default Layout;