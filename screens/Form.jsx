import {
  Text,
  StatusBar,
  StyleSheet,
  Button,
  ScrollView,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useState, useEffect } from 'react';
import {getMoneyTypes} from "../api/api"
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from "@react-navigation/native";

const Form = ({navigation, route, transactions, create, update}) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState({});
  const [id, setId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState([]);
  const [dateTimePickerShow, setDateTimePickerShow] = useState(false);

  const validate = () => {
    let valid = true;

    if(data.description.value.trim().length === 0){
      setData( (d) => {
       
       return {...d, description: {
        value: d.description.value,
        error: true,
        errorText: "O campo descrição é obrigatório"
      }};        
      });

      valid = false;
    }

    if(data.value.value.trim().length === 0){
      setData( (d) => {
       
       return {...d, value: {
        value: d.value.value,
        error: true,
        errorText: "O campo valor é obrigatório"
      }};
        
      });

      valid = false;
    }

    if(!Number.isFinite(Number(data.value.value))){
      setData( (d) => {
       
       return {...d, value: {
        value: d.value.value,
        error: true,
        errorText: "O campo valor deve ser numérico"
      }};
        
      });

      valid = false;
    }


    if(data.category.value.trim().length === 0){
      setData( (d) => {
       
       return {...d, category: {
        value: d.category.value,
        error: true,
        errorText: "O campo categoria é obrigatório"
      }};
        
      });
      valid = false;
    }


    if(data.type.value.trim().length === 0){
      setData( (d) => {
       
       return {...d, type: {
        value: d.type.value,
        error: true,
        errorText: "O campo tipo é obrigatório"
      }};
        
      });

      valid = false;
    }

    if(data.currency.value.trim().length === 0){
      setData( (d) => {
       
       return {...d, currency: {
        value: d.currency.value,
        error: true,
        errorText: "O campo moeda é obrigatório"
      }};
        
      });

      valid = false;
    }


    return valid;
  };

  const action = () =>{
    const valid = validate();

    if(!valid)
      return;
      

    const converted  = {
      description: data.description.value,
      value: Number(data.value.value),
      datetime: data.datetime.value,
      category: data.category.value,
      type: data.type.value,
      currency: data.currency.value
    }
    if(id){
         update(id,converted); 
    }else{
        create(converted);
    }
    
    navigation.navigate("list");
  };



  const getData = () => {
    const params = route.params;    
    const _id = params?.id;

    if(_id){
      const transaction = transactions.find( item => item.id === _id);
      
      setId(_id);
      setData({
          description: {
            value: transaction.description,
            error: false,
            errorText: null
          },
          value: {
            value: transaction.value.toString(),
            error: false,
            errorText: null
          },
          datetime: {
            value: transaction.datetime,
            error: false,
            errorText: null
          },
          category: {
            value: transaction.category,
            error: false,
            errorText: null
          },
          type: {
            value: transaction.type,
            error: false,
            errorText: null
          }, 
          currency: {
            value: transaction.currency,
            error: false,
            errorText: null
          }
      });
    }else{
      setId(null);

      const d = {
          description: {
            value: "",
            error: false,
            errorText: null
          },
          value: {
            value: "",
            error: false,
            errorText: null
          },
          datetime: {
            value: new Date(),
            error: false,
            errorText: null
          },
          category: {
            value: "",
            error: false,
            errorText: null
          },
          type: {
            value: "despesa",
            error: false,
            errorText: null
          }, 
          currency: {
            value: "",
            error: false,
            errorText: null
          }
      };
      setData(d);
    }

  }

  useEffect(() => {
    const load = async () => {

      setIsLoading(true);
      try{        
        const curr = await getMoneyTypes();       
        setCurrency(curr);
        setError(null);
        getData();
      }catch(err){
          setError(err?.message ?? err ?? "Um erro inexperado aconteceu");
      }finally{
          setIsLoading(false);
      }
      
    }

    if(isFocused){
      load();
    }
  },[isFocused])

  return (
    <ScrollView contentContainerStyle={[styles.container, {paddingTop: StatusBar.height}]}>
      {
        isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#f4511e"  />
          </View>
        )
        : error != null ? 
        (            
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ):
        (
          <>
          <View style={styles.container_input}>
            <TextInput
              value={data.description?.value}
              style={styles.input}
              placeholder="Digite uma Descrição"
              onChangeText={ (text) => setData({...data, description: {
                value: text,
                error: false,
                errorText: null
              } })}
            />
            {data.description?.error && <Text style={styles.error}>{data.description?.errorText}</Text>}
          </View>
           <View style={styles.container_input}>
            <TextInput
              value={data.value?.value}
              style={styles.input}
              placeholder="Digite um valor"
              keyboardType = 'numeric'
              onChangeText={ (text) =>                 
                setData({...data, value: {
                  value: text,
                  error: false,
                  errorText: null
                  }})              
              }
            />
            {data.value?.error && <Text style={styles.error}>{data.value?.errorText}</Text>}
          </View>
           <View style={styles.container_input}>
            <Picker
              style={styles.select}
              selectedValue={data.category?.value}
              onValueChange={ (text) => setData({...data, category: {
                value: text,
                error: false,
                errorText: null
              } })}
            >
              <Picker.Item label='Selecione uma categoria' value=''/>
              <Picker.Item label='Alimentação' value='Alimentação'/>
              <Picker.Item label='Saúde' value='Saúde'/>
              <Picker.Item label='Moradia' value='Moradia'/>
              <Picker.Item label='Lazer' value='Lazer'/>
              <Picker.Item label='Transporte' value='Transporte'/>
              <Picker.Item label='Outros' value='Outros'/>
            </Picker>
            {data.category?.error && <Text style={styles.error}>{data.category?.errorText}</Text>}
          </View>
          <View style={styles.container_input}>
            <View style={styles.switch_container}>
            <Text style={styles.text}>Receita</Text>
              <Switch           
                trackColor={{false: '#767577', true: '#81b0ff'}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(v) =>{
                  const tp = v  ?"despesa": "receita"
                   setData({...data, type: {
                    value: tp,
                    error: false,
                    errorText: null
                    }})
                }}
                value={data.type?.value === "despesa" ? true: false}
              />
              <Text style={styles.text}>Despesa</Text>
            </View>
            {data.type?.error && <Text style={styles.error}>{data.type?.errorText}</Text>}
          </View>
          <View style={styles.container_input}>
            <Picker
              style={styles.select}
              selectedValue={data.currency?.value}
              onValueChange={ (text) => setData({...data, currency: {
                value: text,
                error: false,
                errorText: null
              } })}
            >
              <Picker.Item label='Selecione uma moeda' value=''/>
              {currency
                    .map(c =>
                      <Picker.Item label={c.nomeFormatado} value={c.simbolo} />
                  )
              }
            </Picker>
            {data.currency?.error && <Text style={styles.error}>{data.currency?.errorText}</Text>}
          </View>
           <View style={styles.container_input}>
            <Pressable style={styles.input}  onPress={() => setDateTimePickerShow(true)}>
              <View >
                <Text style={styles.text}>{data.datetime?.value.toLocaleString('pt-BR')}</Text>
              </View>
            </Pressable>
            {dateTimePickerShow && <DateTimePicker
              value={data.datetime?.value}
              onChange={(_, date) => {
                  setDateTimePickerShow(false);
                  if (date)
                      setData({...data, datetime: {
                        value: date,
                        error: false,
                        errorText: null
                        } })
              }}
            />}
            {data.datetime?.error && <Text style={styles.error}>{data.datetime?.errorText}</Text>}
          </View>
          <View style={styles.button_container}>
            <Button title="Acessar" onPress={action} color="#f4511e" />
          </View>
          </>
        )
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "ice",
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: 15,
    padding: 15,    
  },
  center:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
   container_input: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: 15,
    padding: 15,
  },  
  switch_container:{
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  select:{
    padding: 10, 
    backgroundColor: "ice",    
    borderWidth: 2,    
    borderColor: "black",
    borderRadius: 10
  },
  text:{
    textAlign: 'justify',
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold'
  },
  error: {
    textAlign: 'justify',
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold'
  },
  input:{
    padding: 10,
    borderWidth: 2,    
    borderColor: "black",
    borderRadius: 10
  },
  button_container:{
    flex: 1,
    justifyContent: 'flex-end',
  },
})


export default Form;