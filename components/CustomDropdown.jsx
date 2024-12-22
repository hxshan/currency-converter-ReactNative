import { View, Text, TouchableOpacity, FlatList,TextInput,StyleSheet } from "react-native";
import React, { useState } from "react";

const CustomDropdown = ({
  data,
  selectedItem,
  setSelectedItem,
  placeholder,
  label
}) => {
  const [isopen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSelect = (item) => {
    //console.log(item);
    setIsOpen(false);
    setSelectedItem(item);
    setSearch("")
  };
  const filter = (search) =>{
    setSearch(search.trim())
    if(search === ""){
      setFilteredData(data)
      return
    }

    const filtered = data.filter((item)=>{
      return(
        item.key.toLowerCase().includes(search.toLowerCase())||
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    })
    setFilteredData(filtered);
  }


  return (
    <View className="w-full gap-2">
        <Text className="text-black font-semibold dark:text-white text-xl"> {label}</Text>
      <View className="w-full">
        <TouchableOpacity
          style={styles.shadow}
          className="border border-gray-300 rounded-md p-3 bg-gray-100  dark:bg-neutral-800 dark:text-white"
          onPress={() => {
            setIsOpen(!isopen);
          }}
        >
          <Text className=" dark:text-white">
            {selectedItem
              ? selectedItem.key + " - " + selectedItem.label
              : placeholder}
          </Text>
        </TouchableOpacity>
        {isopen && (
           <View className="mt-2 border border-gray-300 rounded-md bg-white dark:bg-neutral-800">
            <TextInput
              className="p-3 border-b border-gray-200 bg-gray-white text-black dark:text-white placeholder:dark:text-white focus:border-blue-500"
              placeholder="Search..."
              value={search}
              onChangeText={(value)=>filter(value)}
            />
          <FlatList
            
            style={{ maxHeight: 120 }}
            data={filteredData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  className="p-3 border-b border-gray-200 bg-white dark:bg-neutral-800"
                  onPress={() => {
                    handleSelect(item);
                  }}
                >
                  <Text className="w-full h-fit text-black dark:text-white">
                    {item.key} - {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          /></View>
        )}
      </View>
    </View>
  );
};

export default CustomDropdown;

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
