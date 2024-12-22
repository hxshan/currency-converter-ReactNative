import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet,TouchableOpacity, Image, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDropdown from "../components/CustomDropdown";
import CustomInputField from "../components/CustomInputField";
import { useColorScheme } from "nativewind";
import {API_KEY} from '@env'
import ApiEndpoint from "../constants/endpoints";
import icons from "../constants/icons";

export default function App() {

  const {colorScheme,toggleColorScheme}=useColorScheme();

  const [symbols, setSymbols] = useState([]);
  const [isloading, setIsloading] = useState(false);


  const [error, setError] = useState(null);
  const [amountError, setAmountError] = useState(null);
  const [convertionError, setConvertionError] = useState(null);


  const [selectedFromCurr, setSelectedFromCurr] = useState(null);
  const [selectedToCurr, setSelectedToCurr] = useState(null);
  const [amount,setAmount] = useState(1);
  const [convertion,setConvertion] = useState(null);

  //fetch LKR,USD ect
  const getCurrencySymbols = async () => {
    setIsloading(true);
    setError(null);
    try {
      const response = await fetch(
        `${ApiEndpoint}/symbols?access_key=${API_KEY}&format=1`
      );
      const data = await response.json();
      if (data.success) {
        let symbols = Object.entries(data.symbols).map(([key, value]) => ({
          key: key,
          label: value,
        }));
        setSymbols(symbols);

      } else {
        setError(data.error);
        Alert.alert("Error",`${data?.error?.message}`)
      }
    } catch(error) {
      setError("An Unexpected Error Ocurred :( ");
      Alert.alert("Error",'Something went wrong')
    }
    setIsloading(false);
  };

  const getConvertion = async(from,to,amount) =>{
    setConvertionError(null)
    setAmountError(null)
    if(amount < 0) {
      setAmountError("Amount cannot be negative!")
      return;
    }
    if(from === null || to === null){
      return;
    }
    try{
      const response = await fetch(`${ApiEndpoint}/latest?access_key=${API_KEY}&base=${from.key}&to=${to.key}`)
      const data = await response.json();
      if(data?.error){
        console.log(data.error)
        if(data.error.code == 'base_currency_access_restricted'){
          setConvertionError(`Cannot convert from ${selectedFromCurr.key} to ${selectedToCurr.key} \nUpgrade your plan`)
        }else{
          setConvertionError(`ERROR  ${data?.error?.code}`)
        }
      }
      let rate = Number(data.rates?.[`${to.key}`]) * Number(amount)
      setConvertion(rate);
    }catch(error){
      setConvertionError(`Unexpected technical error has occured`)
      Alert.alert("Error",'Something went wrong')
    }
  }

  const switchCurrency = () =>{
    let temp = selectedFromCurr;
    setSelectedFromCurr(selectedToCurr)
    setSelectedToCurr(temp)
  }
  
  useEffect(() => {
    getCurrencySymbols();
  }, []);

  useEffect(() => {
    getConvertion(selectedFromCurr,selectedToCurr,amount);
  }, [amount,selectedFromCurr,selectedToCurr]);

  return (
    <SafeAreaView className="flex-1 w-full h-full justify-center items-center bg-slate-100 dark:bg-neutral-900 px-4 ">
      <View
        className="w-full justify-center items-center rounded-xl py-8 px-6 bg-slate-50 dark:bg-zinc-800"
        style={colorScheme == 'light'? styles.shadow:styles.lightShadow}
      >
        
        <View className="w-full flex flex-row justify-between items-center mb-6">
          <Text className="font-bold text-3xl dark:text-white">
            Currency Converter
          </Text>
          <TouchableOpacity
           className="w-8 h-8 flex justify-center items-center rounded-full border border-black dark:border-gray-200"
           onPress={toggleColorScheme}>
            <Image
              className="w-6 h-6"
              resizeMode="contain"
              source={colorScheme == 'dark'?icons.sun:icons.moon}
            />
          </TouchableOpacity>
          
        </View>
        {symbols.length > 0 && (
          <View className="gap-4 w-full">
            <CustomInputField
              placeholder={"Amount"}
              type={"numeric"}
              value={amount}
              setValue={setAmount}
              error={amountError}
            />
            <CustomDropdown
              data={symbols}
              placeholder={"Select Currency"}
              label={"From"}
              selectedItem={selectedFromCurr}
              setSelectedItem={setSelectedFromCurr}
            />
            <View className="w-full justify-center items-center">
              <TouchableOpacity
                className="w-16 h-16 justify-center items-center p-4 rounded-full border border-black dark:border-white"
                onPress={switchCurrency}
              >
                <Image
                  className="w-full h-full "
                  source={colorScheme =='light'?icons.switchDark:icons.switchLight}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <CustomDropdown
              data={symbols}
              placeholder={"Select Currency"}
              label={"To"}
              selectedItem={selectedToCurr}
              setSelectedItem={setSelectedToCurr}
            />

            <Text className="font-bold dark:text-white text-2xl">
              {amount} {selectedFromCurr?.key} = 
            </Text>
            <Text className="font-bold text-center text-4xl dark:text-white">
              {convertion?.toFixed(2)} {selectedToCurr?.key}
            </Text>
            {convertionError && (
              <Text className="font-semibold text-xl text-red-500">
                {convertionError}
              </Text>
            )}
          </View>
        )}

        {isloading && <Text>Loading ...</Text>}
        {error && (
          <View className="flex justify-center items-center">
            <View className="w-full flex">
              <Image
                className="w-[200px] h-[150px]"
                resizeMode="contain"
                source={icons.sadIcon}
              />
            </View>
            <Text className="font-bold text-red-600">Error : {error.code}</Text>
            <Text className="font-semibold">{error.message}</Text>  
          </View>
        )}
      </View>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  shadow: {
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6,
  },
  lightShadow:{
    shadowColor: "#0084FF",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.7,
      shadowRadius: 1,

      elevation: 6,
  }
})

