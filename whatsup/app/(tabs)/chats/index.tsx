import { View, Text } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import chats from '@/assets/data/chats.json'
import { defaultStyles } from "@/constants/Styles";
import ChatRow from '@/components/ChatRow';

const Page = () =>{

    return(
        <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{paddingBottom:40, paddingTop:100, backgroundColor:'#fff'}}
        >
            <FlatList 
            scrollEnabled={false}
            data={chats}
            keyExtractor={(item)=>item.id}
            ItemSeparatorComponent={()=><View style={[defaultStyles.separator,{marginLeft:90}]}></View>}
            renderItem={({ item }) => <ChatRow {...item} />}
            />

        </ScrollView>
    );
}

export default Page