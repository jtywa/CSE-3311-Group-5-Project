// index.tsx
import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { type Building, type RoomSearchResult } from '../assets/map asset/marker';
import FloorPlanViewer from './components/FloorPlanViewer';
import SearchBar from './components/SearchBar';
import LoadingScreen from './components/LoadingScreen';

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
      title: `${result.building.code} — Room ${result.room.number}` 
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
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
        {pin && (
          <Marker
            coordinate={{ latitude: pin.lat, longitude: pin.lon }}
            title={pin.title}
          />
        )}
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
      <Modal
        visible={showFloorPlan}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFloorPlan(false)}
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});
