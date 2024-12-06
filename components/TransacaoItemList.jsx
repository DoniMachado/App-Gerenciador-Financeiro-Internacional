import {
  Text,
  StyleSheet,
  View,
  useWindowDimensions ,
  Pressable
} from 'react-native';
import { useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {getExchangeRate} from "../api/api"
import { GestureHandlerRootView  } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const TransacaoItem = ({item, navigation, remove}) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [exchangeRate, setExchangeRate] = useState(null);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

  useEffect(() =>{
    const load = async () => {
      const excrate = await getExchangeRate(item.currency,formatDate(item.datetime), item.type);
      setExchangeRate(excrate);
    }
    
    load()
  },[item])

  return (
    <GestureHandlerRootView style={styles.space}>
      <ReanimatedSwipeable
        renderLeftActions={(_, drag) => {
            const styleAnimation = useAnimatedStyle(() => {
                    return {
                        transform: [{ translateX: drag.value - 50 }]
                    }
                });
          return (
              <Reanimated.View style={[styles.icon,styleAnimation]}>
                  <Pressable
                      style={styles.box}
                      onPress={() => remove(item.id)}
                  >
                      <FontAwesome5 name="trash" size={25} color="white" />
                  </Pressable>
              </Reanimated.View>
          );
        }}
        renderRightActions={(_, drag) => {
          const styleAnimation = useAnimatedStyle(() => {
                    return {
                        transform: [{ translateX: drag.value + 50 }]
                    }
                });
          return (
              <Reanimated.View style={[styles.icon,styleAnimation]}>
                  <Pressable
                      style={styles.box}
                       onPress={() => navigation.navigate("form",{id: item.id})}
                  >
                      <FontAwesome5 name="edit" size={25} color="white" />
                  </Pressable>
              </Reanimated.View>
          );
        }}
      >
        {
          isLandscape ? 
          (
            <View style={styles.container}>
              <MaterialIcons name="attach-money" size={25} color="black" />
              <View style={styles.column}>
                <Text style={styles.text}>{item.description}</Text>
                <Text style={styles.text}>{new Date(item.datetime).toLocaleDateString('pt-BR')}</Text>
                <Text style={styles.text}>{new Date(item.datetime).toLocaleTimeString('pt-BR')}</Text>
              </View>
            <View style={styles.column}>
                <Text style={styles.value}>{ exchangeRate ?`R$  ${(exchangeRate * item.value).toFixed(2)}`: `${item.currency} ${item.value.toFixed(2)}`}</Text>
                <Text style={styles.text}>{item.category}</Text>
                <Text style={styles.text}>{item.type}</Text>
            </View>
            </View>
          ): 
          (
            <View style={styles.container}>
              <MaterialIcons name="attach-money" size={25} color="black" />
              <Text style={styles.text}>{item.description}</Text>
              <Text style={styles.value}>{ exchangeRate ?`R$  ${(exchangeRate * item.value).toFixed(2)}`: `${item.currency} ${item.value.toFixed(2)}`}</Text>
            </View>
          )
        }
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
    );

}

const styles = StyleSheet.create({
  space:{
    marginBottom: 10,
  },
  container: {   
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: "#f4511e",
    minHeight: 50
  },
  text:{
    flex:1,
    overflow: 'hidden',
    fontSize: 12,
    color: 'black',   
    textAlign: 'center' 
  },
  value:{
    flex:1,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center' 
  },
  column:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  box:{
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4511e"
  }
})


export default TransacaoItem;