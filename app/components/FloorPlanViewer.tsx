import React, { useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { type Floor, type Room } from '../../assets/map asset/marker';

interface FloorPlanViewerProps {
  buildingName: string;
  buildingCode: string;
  floor: Floor;
  targetRoom?: Room;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FloorPlanViewer({ 
  buildingName, 
  buildingCode, 
  floor, 
  targetRoom,
  onClose 
}: FloorPlanViewerProps) {
  const [scale, setScale] = useState(1);
  const scrollViewRef = useRef<any>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.buildingName}>{buildingName}</Text>
            <Text style={styles.floorName}>{floor.name}</Text>
            {targetRoom && (
              <Text style={styles.roomInfo}>Room {targetRoom.number}</Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floor Plan Container */}
      <GestureScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pinchGestureEnabled={true}
        bounces={false}
      >
        <View style={[styles.floorPlanContainer, { transform: [{ scale }] }]}>
          {/* Floor Plan Image */}
          {floor.mapImage ? (
            <Image 
              source={floor.mapImage}
              style={styles.floorPlanImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.floorPlanPlaceholder}>
              <Text style={styles.placeholderText}>
                No floor plan available
              </Text>
              <Text style={styles.placeholderSubtext}>
                Add floor plan image to display
              </Text>
            </View>
          )}
        </View>
      </GestureScrollView>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity 
          style={styles.zoomButton}
          onPress={handleZoomIn}
        >
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.zoomButton, styles.zoomButtonMiddle]}
          onPress={handleResetZoom}
        >
          <Text style={styles.zoomResetText}>{Math.round(scale * 100)}%</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.zoomButton}
          onPress={handleZoomOut}
        >
          <Text style={styles.zoomButtonText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buildingName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  floorName: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  roomInfo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  floorPlanContainer: {
    position: 'relative',
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 250,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  floorPlanImage: {
    width: '100%',
    height: '100%',
  },
  floorPlanPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  zoomButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  zoomButtonMiddle: {
    borderBottomWidth: 1,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007AFF',
  },
  zoomResetText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#007AFF',
  },
});

