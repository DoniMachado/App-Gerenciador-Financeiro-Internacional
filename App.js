import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { FontAwesome6 , FontAwesome } from '@expo/vector-icons';

import Login from './screens/Login.jsx';
import TransacaoListScreen from './screens/TransacaoListScreen.jsx';
import Form from './screens/Form.jsx';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([
    {"id":"uid-26z5k0vqhgw","description":"32","value":3256,"datetime":"2024-11-01T19:45:33.746Z","category":"Alimentação","type":"despesa","currency":"NOK"},
    {"id":"uid-26z5k0p3hgw","description":"description","value":125,"datetime":"2024-11-07T12:41:57.746Z","category":"Saúde","type":"despesa","currency":"USD"},
     {"id":"uid-26ajk0p3hgw","description":"description","value":370,"datetime":"2024-11-09T23:28:33.746Z","category":"Lazer","type":"receita","currency":"USD"}
  ]
);

  const authenticate = (login, password) =>  {
    setUser({ login, password });
    setIsAuthenticated(true);
  }

  const logout = () => {
    setUser({});
    setIsAuthenticated(false);
  }

  const genUUID = () => {
    return "uid-" + Math.random().toString(36).substr(2, 18);
  };

  const remove = (id) => {
    const clone = [...transactions];
    const idx = clone.findIndex(item => item.id === id);
    clone.splice(idx,1);
    setTransactions(clone);
  }

  const create = (item) => {
    const clone = [...transactions];
    const newItem = {
      id: genUUID(),
      ...item,
    }
    clone.push(newItem);
    setTransactions(clone);
  }

  const update = (id, item) => {
    const clone = [...transactions];
    const idx = clone.findIndex(item => item.id === id);
    clone[idx] = item;
    setTransactions(clone);
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#f4511e',
          tabBarInactiveTintColor: 'gray',
        }}>
        {!isAuthenticated ? (
          <>
            <Tab.Screen
              name="login"
              options={{
                tabBarStyle: { display: 'none' },
              }}>
              {(navigation, route) => (
                <Login
                  navigation={navigation}
                  route={route}
                  authenticate={authenticate}
                />
              )}
            </Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen
              name="list"
              options={{
                title: 'Listagem',
                tabBarIcon: ({ focused, color, size }) => (
                  <FontAwesome
                    name={'list-alt'}
                    size={size}
                    color={color}
                  />
                ),
              }}>
              {({navigation, route}) => (
                <TransacaoListScreen navigation={navigation} route={route} transactions={transactions} remove={remove}/>
              )}
            </Tab.Screen>

            <Tab.Screen
              name="form"
              options={{
                title: 'Formulário',
                tabBarIcon: ({ focused, color, size }) => (
                 <FontAwesome6 name="money-bill-transfer" size={size} color={color} />
                ),
              }}>
              {({navigation, route}) => (
                <Form navigation={navigation} route={route} create={create} update={update} transactions={transactions}/>
              )}
            </Tab.Screen>
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
