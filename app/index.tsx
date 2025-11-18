import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import { Button, Modal, StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { type Building, type RoomSearchResult } from "../assets/map asset/marker";
import FilterModal from "../components/FilterModal";
import { IconBubble } from "../components/IconBubble";
import FloorPlanViewer from "./components/FloorPlanViewer";
import LoadingScreen from "./components/LoadingScreen";
import SearchBar from "./components/SearchBar";

import resources from "@/app/data/resources.json";

const initialRegion: Region = {
  latitude: 32.7296,
  longitude: -97.1133,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [pin, setPin] = useState<{ lat: number; lon: number; title: string } | null>(null);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomSearchResult | null>(null);
  const mapRef = useRef<MapView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filters, setFilters] = useState({
    restrooms: false,
    cafes: false,
    vending: false,
    study: false,
  });

  React.useEffect(() => {
    (async () => {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }

      // Get current position
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleBuildingFound = (building: Building) => {
    const region: Region = {
      latitude: building.lat,
      longitude: building.lon,
      latitudeDelta: 0.004, // zoom in close
      longitudeDelta: 0.004,
    };
    mapRef.current?.animateToRegion(region, 600);
    setPin({ lat: building.lat, lon: building.lon, title: `${building.code} — ${building.name}` });
  };

  const handleRoomFound = (result: RoomSearchResult) => {
    // First, zoom to the building on the map
    const region: Region = {
      latitude: result.building.lat,
      longitude: result.building.lon,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    };
    mapRef.current?.animateToRegion(region, 600);
    setPin({
      lat: result.building.lat,
      lon: result.building.lon,
      title: `${result.building.code} — Room ${result.room.number}`,
    });

    // Then show the floor plan
    setSelectedRoom(result);
    setShowFloorPlan(true);
  };

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} showsUserLocation={true}>
        {pin && <Marker coordinate={{ latitude: pin.lat, longitude: pin.lon }} title={pin.title} />}

        {/* Cafes */}
        {Object.entries(resources.cafes).map(([id, item]) => {
          if (!item || !item.coords || item.coords.length < 2) return null;
          const [lon, lat] = item.coords;
          if (typeof lat !== "number" || typeof lon !== "number") return null;

          return (
            <Marker
              key={`cafe-${id}`}
              coordinate={{ latitude: lat, longitude: lon }}
              opacity={filters.cafes ? 1 : 0} // <- visibility controlled here
              tracksViewChanges={false}
            >
              <IconBubble icon="food" color="#c85000" />
            </Marker>
          );
        })}

        {/* Vending */}
        {Object.entries(resources.vending).map(([id, item]) => {
          if (!item || !item.coords || item.coords.length < 2) return null;
          const [lon, lat] = item.coords;
          if (typeof lat !== "number" || typeof lon !== "number") return null;

          return (
            <Marker key={`vending-${id}`} coordinate={{ latitude: lat, longitude: lon }} opacity={filters.vending ? 1 : 0} tracksViewChanges={false}>
              <IconBubble icon="bottle-soda" color="#00ff73ff" />
            </Marker>
          );
        })}

        {/* Restrooms */}
        {Object.entries(resources.restrooms).map(([id, item]) => {
          if (!item || !item.coords || item.coords.length < 2) return null;
          const [lon, lat] = item.coords;
          if (typeof lat !== "number" || typeof lon !== "number") return null;

          return (
            <Marker key={`restroom-${id}`} coordinate={{ latitude: lat, longitude: lon }} opacity={filters.restrooms ? 1 : 0} tracksViewChanges={false}>
              <IconBubble icon="toilet" color="#22a6aaff" size={24} />
            </Marker>
          );
        })}

        {/* Study spots */}
        {Object.entries(resources.study).map(([id, item]) => {
          if (!item || !item.coords || item.coords.length < 2) return null;
          const [lon, lat] = item.coords;
          if (typeof lat !== "number" || typeof lon !== "number") return null;

          return (
            <Marker key={`study-${id}`} coordinate={{ latitude: lat, longitude: lon }} opacity={filters.study ? 1 : 0} tracksViewChanges={false}>
              <IconBubble icon="sofa" color="#7a3cff" size={24} />
            </Marker>
          );
        })}
      </MapView>
      <SearchBar
        onBuildingFound={handleBuildingFound}
        onRoomFound={handleRoomFound}
        onSearchSubmit={() => {}}
        onClear={() => {
          setPin(null);
          setShowFloorPlan(false);
          setSelectedRoom(null);
        }}
      />

      {/* Floor Plan Modal */}
      <Modal visible={showFloorPlan} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFloorPlan(false)}>
        {selectedRoom && (
          <FloorPlanViewer
            buildingName={selectedRoom.building.name}
            buildingCode={selectedRoom.building.code}
            floor={selectedRoom.floor}
            targetRoom={selectedRoom.room}
            onClose={() => setShowFloorPlan(false)}
          />
        )}
      </Modal>
      <FilterModal visible={modalVisible} onClose={() => setModalVisible(false)} filters={filters} setFilters={setFilters} />
      <View style={styles.buttonContainer}>
        <Button title="Open Filters" onPress={() => setModalVisible(true)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 40,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
});
