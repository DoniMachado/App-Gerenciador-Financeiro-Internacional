import {
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Pressable,
  View,
  TextInput,
  Image,  
} from 'react-native';
import { useState } from 'react';
import defaultIcon from "../assets/default-icon.png"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Login = ({navigation, route, authenticate}) => {
  const [obscure, setObscure]= useState(true);
  const [data,setData] = useState({
    login: {
      value: "",
      error: false,
      errorText: null
    },
    password: {
      value: "",
      error: false,
      errorText: null
    },
  });

  const validate = () => {
    let valid = true;
    let errorLogin = null;
    let errorPassword = null;

    if(!data.login.value)
      errorLogin = "O login é um campo obrigatório";

    if(!data.password.value)
      errorPassword = "A senha é um campo obrigatório";

    const clone = {...data};

    if(errorLogin){
      clone.login.error = true;
      clone.login.errorText = errorLogin;
      valid = false;
    }

    if(errorPassword){
      clone.password.error = true;
      clone.password.errorText = errorPassword;
      valid = false;
    }
    
    setData(clone);
    return valid;
  }

  const login = () => {
      const valid = validate();

      console.log(valid);
      if(!valid)
        return;

      authenticate(data.login, data.password);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container_avatar}>
        <Image style={styles.avatar} source={defaultIcon} />
      </View>
      <View style={styles.container_input}>
        <TextInput
          value={data.login.value}
          style={styles.input}
          placeholder="Digite seu login"
          onChangeText={ (text) => setData({...data, login: {
            value: text,
            error: false,
            errorText: null
          } })}
         />
         {data.login.error && <Text style={styles.error}>{data.login.errorText}</Text>}
      </View>
       <View style={[styles.container_input, {position: 'relative'}]}>
            <TextInput
          value={data.password.value}
          style={styles.input}
          secureTextEntry={obscure}
          placeholder="Digite sua senha"
          onChangeText={ (text) => setData({...data, password: {
            value: text,
            error: false,
            errorText: null
          } })}
         />
         <Pressable onPress={() => {
           setObscure(!obscure)
         }}
          style={styles.password_icon}
         >
         <FontAwesome5 name={obscure ?"eye":"eye-slash"} size={24} color="black" />
         </Pressable>
         {data.password.error && <Text style={styles.error}>{data.password.errorText}</Text>}
      </View>
      <View style={styles.button_container}>
        <Button title="Acessar" onPress={login} color="#f4511e" />
      </View>
    </SafeAreaView>
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
    height: '100vh'
  },
   container_input: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: 15,
    padding: 15,
  },
  container_avatar:{
    width: '100%',
    height: '30%',
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
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
  avatar:{
    height:'100%',
    resizeMode: 'center',
  },
  button_container:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  password_icon:{
    position: 'absolute',
    top: 25,
    right: 25
  }
});

export default Login 