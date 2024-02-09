import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Keyboard} from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';

const hStatusBarHeight = StatusBar.curr
const KeyGpt = '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';

export default function App() {
  const [carregando, setCarregando] = useState(false);
  const [travel, setTravel]=useState("");
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
 

  async function Gerar(){
    if(city===""){
      Alert.alert("Atenção","Preencha a Cidade Desejada")
      return;
    }
    setCarregando(true);

    Keyboard.dismiss();

    const prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados,
     seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`

    fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization: `Bearer ${KeyGpt}`

      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[
          {
            role:'user',
            content:prompt
          }
        ],
        temperature:0.20,
        max_tokens:500,
        top_p:1,
      })
    })
    .then(responce =>responce.json())
    .then((data)=>{
      console.log(data);
      
    })
    .catch((error)=>{
      console.log(error);
    })
    .finally(()=>{
      setCarregando(false);
    })

  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Roteiro de Viagem</Text>
      <StatusBar barStyle="dark-content"/>
      <View style={styles.form}>
        <Text>
          Destino da Viagem
        </Text>
        <TextInput
        placeholder='Ex: São Paulo, SP'
        value={city}             
        onChangeText={(text)=>setCity(text)}
        style={styles.input}/>
        <Text>
          Tempo de Estadia: {days.toFixed(0)} dias          
        </Text>
        <Slider
            minimumValue={1}
          maximumValue={10}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value)=> setDays(value)}
/>
      </View>
      <TouchableOpacity style={styles.btn}
      onPress={Gerar}
      
      >
        <Text>
          Gerar Roteiro de Viagem
        </Text>
      </TouchableOpacity>
      <ScrollView style={styles.scroll}>
        {carregando && (
          <View>
          <Text>
            Carregando Roteiro
          </Text>
          <ActivityIndicator
          color={'blue'}/>
          <Text>
            {travel}
          </Text>
        </View>
        )}
        {travel && (
          <View>
          <Text>
            Roteiro da Viagem
          </Text>
          <Text>
            {travel}
          </Text>
        </View>
        )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    paddingTop:30
  },
  text:{
    fontWeight:'bold',
    fontSize:30
  },
  form:{
    backgroundColor:'red',
    width:'90%',  
  },
  btn:{
    backgroundColor:'blue',
    width:'90%',
    alignItems:'center',
    padding:14,
    borderRadius:14,
    marginTop:20
  },
  scroll:{
    width:'90%',
    marginTop:20
  }


});
