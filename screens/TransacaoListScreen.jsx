import {
 FlatList,
 Text,
 View,
 StyleSheet,
 StatusBar,
 TextInput
} from 'react-native';
import TransacaoItem from "../components/TransacaoItemList.jsx"
import { Picker } from '@react-native-picker/picker';
import {useState, useEffect} from 'react'

const List = ({navigation, route, transactions, remove}) => {

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [order,setOrder] = useState("");

  useEffect(() =>{
    let clone = [...transactions];

    if(filter)
      clone = clone.filter(item => item.description.toLowerCase() === filter.toLowerCase()  )
    
    if(order)
    {
      switch(order){
        case 'description-asc':
          clone.sort((x, y) => x.description.localeCompare(y.description));
          break;
        case 'description-desc':
          clone.sort((x, y) => y.description.localeCompare(x.description));
          break;
        case 'category-asc':
          clone.sort((x, y) => x.category.localeCompare(y.category));
          break;
        case 'category-desc':
          clone.sort((x, y) => y.category.localeCompare(x.category));
          break;
        case 'type-asc':
          clone.sort((x, y) => x.type.localeCompare(y.type));
          break;
        case 'type-desc':
          clone.sort((x, y) => y.type.localeCompare(x.type));
          break;
      }
    }

    setFilteredTransactions(clone);

  },[transactions, filter, order])

  const renderItem = ({item}) => {
    return <TransacaoItem item={item} navigation={navigation} remove={remove}/>
  }

  return (
    <View style={[styles.container, {paddingTop: 50}]}>
      <TextInput 
      value={filter}
      style={styles.input}
      placeholder="Digite uma Descrição"
      onChangeText={ (text) => setFilter(text)}
      />
      <Picker
        style={styles.select}
        selectedValue={order}
        onValueChange={ (text) => setOrder(text)}
      >
        <Picker.Item label='Selecione uma ordem' value=''/>
        <Picker.Item label='Descrição ASC' value='description-asc'/>
        <Picker.Item label='Descrição DESC' value='description-desc'/>
        <Picker.Item label='Categoria ASC' value='category-asc'/>
        <Picker.Item label='Categoria DESC' value='category-desc'/>
        <Picker.Item label='Tipo ASC' value='type-asc'/>
        <Picker.Item label='Tipo DESC' value='type-desc'/>
    </Picker>
    <FlatList 
      data={filteredTransactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={() => <View style={styles.center}><Text style={styles.text}>Lista Vázia</Text></View>}
    />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap:10,
    padding:10
  },
  center:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text:{
    fontSize: 20,
    fontWeight: 'bold',
    color:'black' 
  },
   input:{
    padding: 10,
    borderWidth: 2,    
    borderColor: "black",
    borderRadius: 10
  },  
  select:{
    padding: 10, 
    backgroundColor: "ice",    
    borderWidth: 2,    
    borderColor: "black",
    borderRadius: 10
  },
})

export default List;