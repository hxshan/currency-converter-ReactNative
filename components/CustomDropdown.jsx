import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";

const CustomDropdown = ({
  data,
  selectedItem,
  setSelectedItem,
  placeholder,
  label
}) => {
  const [isopen, setIsOpen] = useState(false);

  const handleSelect = (item) => {
    //console.log(item);
    setIsOpen(false);
    setSelectedItem(item);
  };

  return (
    <View className="w-full gap-2">
        <Text className="text-black font-semibold">{label}</Text>
      <View className="w-full">
        <TouchableOpacity
          className="border border-gray-300 rounded-md p-3 bg-gray-100"
          onPress={() => {
            setIsOpen(!isopen);
          }}
        >
          <Text>
            {selectedItem
              ? selectedItem.key + " - " + selectedItem.label
              : placeholder}
          </Text>
        </TouchableOpacity>
        {isopen && (
          <FlatList
            className="mt-2 border border-gray-300 rounded-md bg-white"
            style={{ maxHeight: 200 }}
            data={data}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  className="p-3 border-b border-gray-200 bg-white"
                  onPress={() => {
                    handleSelect(item);
                  }}
                >
                  <Text className="w-full h-fit text-black">
                    {item.key} - {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default CustomDropdown;
