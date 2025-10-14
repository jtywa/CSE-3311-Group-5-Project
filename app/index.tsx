import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { Text, StyleSheet, Pressable, View, TextInput, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';

const initialMapRegion = {
  latitude: 32.73067429756074, 
  longitude: -97.11457017204455, 
  latitudeDelta: 0.016, 
  longitudeDelta: 0.009, 
};

export default function App() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isCheckedVending, setCheckedVending] = useState(false);
  const [isCheckedRestrooms, setCheckedRestrooms] = useState(false);
  const [isCheckedRestaurants, setCheckedRestaurants] = useState(false);
  const [isCheckedEvents, setCheckedEvents] = useState(false);
  const [isCheckedEtc, setCheckedEtc] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container} >
        <TextInput 
          style={[styles.input, focused && styles.inputFocused]}
          placeholder="Search here"
          placeholderTextColor="#777"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Pressable style={styles.openButton} onPress={() => setIsModalVisible(true)}><Text style={styles.white}>Open Filters</Text><Ionicons name="filter-sharp" size={20} color="#aaa" /></Pressable>
        <Modal visible={isModalVisible} animationType="slide" presentationStyle="formSheet">
          <View style={styles.modal}>
            <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}><Text style={styles.white}>Close Filters</Text></Pressable>
            <View style={styles.modalItem}>
              <Text style={styles.modalText}>Vending Machines</Text>
              <Checkbox style={styles.checkbox} value={isCheckedVending} onValueChange={setCheckedVending} />
            </View>
            <View style={styles.modalItem}>
              <Text style={styles.modalText}>Restrooms</Text>
              <Checkbox style={styles.checkbox} value={isCheckedRestrooms} onValueChange={setCheckedRestrooms} />
            </View>
            <View style={styles.modalItem}>
              <Text style={styles.modalText}>Restaurants</Text>
              <Checkbox style={styles.checkbox} value={isCheckedRestaurants} onValueChange={setCheckedRestaurants} />
            </View>
            <View style={styles.modalItem}>
              <Text style={styles.modalText}>Events</Text>
              <Checkbox style={styles.checkbox} value={isCheckedEvents} onValueChange={setCheckedEvents} />
            </View>
            <View style={styles.modalItem}>
              <Text style={styles.modalText}>Etc</Text>
              <Checkbox style={styles.checkbox} value={isCheckedEtc} onValueChange={setCheckedEtc} />
            </View>
          </View>
        </Modal>
        <MapView style={styles.map} mapType="satellite" initialRegion={initialMapRegion}/>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  checkbox: {
  },
  modalItem: {
    paddingHorizontal: 32,
    paddingTop: 16,
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  modalText: {
    fontSize: 24,
    color: "#aaa",
  },
  white: {
    color: "#aaa",
    fontWeight: "bold"
  },
  modal: {
    padding: 0,
    margin: 0,
    backgroundColor: "#111213ff",
    height: "100%"
  },
  openButton: {
    zIndex: 10,
    backgroundColor: "#1e1f21",
    position: "absolute",
    bottom: 0,
    paddingTop: 16,
    paddingBottom: 32,
    width: "100%",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  closeButton: {
    zIndex: 10,
    backgroundColor: "#1e1f21",
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  input: {
      position: "absolute",
      top: 64, // adjust for your header height
      left: 16,
      right: 16,
      zIndex: 10,
      backgroundColor: "#1e1f21",
      borderColor: "transparent",
      borderWidth: 2,
      fontSize: 20,
      borderRadius: 8,
      padding: 12,
      color: "#bbb"
  },
    inputFocused: {
    borderColor: "#0080ff",
    backgroundColor: "#111213ff",
    color: "#bbb"
  },
});