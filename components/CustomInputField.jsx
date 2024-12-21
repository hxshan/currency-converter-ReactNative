import { View, Text,TextInput } from 'react-native'
import React from 'react'

const CustomInputField = ({type,placeholder,value,setValue,error}) => {
  return (
    <View className="w-full ">
     <TextInput
      className="w-full border border-gray-300 rounded-md p-3 bg-gray-100"
      placeholder={placeholder}
      keyboardType={type}
      value={value.toString()}
      onChangeText={(value)=>{setValue(value)}}
     />
     {
        error != null && <Text className="text-red-500 font-semibold text-xl">** {error} **</Text>
     }
     
    </View>
  )
}

export default CustomInputField