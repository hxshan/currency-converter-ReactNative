import { View, Text,TextInput,StyleSheet } from 'react-native'
import React from 'react'

const CustomInputField = ({type,placeholder,value,setValue,error}) => {
  return (
    <View className="w-full ">
     <TextInput
     style={styles.shadow}
      className="w-full border border-gray-300 rounded-md p-3 font-semibold bg-gray-100
       dark:bg-neutral-800 dark:text-white placeholder:dark:text-white"
      placeholder={placeholder}
      keyboardType={type}
      value={value.toString()}
      onChangeText={(value)=>{setValue(value)}}
     />
     {
        error != null && <Text className="text-red-500 font-semibold text-xl"> {error}</Text>
     }
     
    </View>
  )
}

export default CustomInputField
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 2,

    elevation: 6,
},
})