import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet,TouchableOpacity, Image } from "react-native";
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
      //console.log(data)
      if (data.success) {
        let symbols = Object.entries(data.symbols).map(([key, value]) => ({
          key: key,
          label: value,
        }));
        //console.log(symbols)
        setSymbols(symbols);
      } else {
        setError(data.error?.info);
      }
    } catch {
      setError("An Unexpected Error Ocurred :( ");
    }
    setIsloading(false);
  };

  const getConvertion = async(from,to,amount) =>{
    setConvertionError(null)
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
        setConvertionError(`ERROR : ${data?.error?.code}`)
      }
      let rate = Number(data.rates?.[`${to.key}`]) * Number(amount)
      setConvertion(rate);
    }catch{

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
    <SafeAreaView className="flex-1 w-full h-full justify-center items-center bg-white px-4">
      <View className="w-full  justify-center items-center rounded-xl py-8 px-6 bg-slate-50" style={styles.shadow}>
        {symbols.length > 0 ? (
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
                className="w-16 h-16 bg-blue-600 justify-center items-center p-4 rounded-full"
                onPress={switchCurrency}
              >
                <Image className="w-full h-full " source={icons.switchIcon} resizeMode="contain"/>
              </TouchableOpacity>
            </View>
            <CustomDropdown
              data={symbols}
              placeholder={"Select Currency"}
              label={"To"}
              selectedItem={selectedToCurr}
              setSelectedItem={setSelectedToCurr}
            />

            <Text>{amount} {selectedFromCurr?.key} = {convertion} {selectedToCurr?.key}
            </Text>
{
  convertionError &&
  <Text className="font-semibold text-xl text-red-500">
    {convertionError}
  </Text>
}
          </View>
        ) : (
          <></>
        )}

        {isloading && <Text>Loading ...</Text>}
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
  }
})

