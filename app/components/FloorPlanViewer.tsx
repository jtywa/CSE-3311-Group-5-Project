import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { type Floor, type Room } from '../../assets/map asset/marker';
import { getRoomCoordinates, type RoomCoordinate } from '../../assets/map asset/roomDataLoader';

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
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);

  // Get room coordinates from JSON data for the target room only
  const targetRoomCoords = useMemo<RoomCoordinate | null>(() => {
    if (!targetRoom) return null;
    
    // Try to get coordinates with the room number as-is
    let coords = getRoomCoordinates(buildingCode, floor.level, targetRoom.number);
    
    // For basement rooms, try both with and without "B" prefix
    if (!coords && floor.level === 'B') {
      if (targetRoom.number.startsWith('B')) {
        // Try without "B" prefix
        coords = getRoomCoordinates(buildingCode, floor.level, targetRoom.number.substring(1));
      } else {
        // Try with "B" prefix
        coords = getRoomCoordinates(buildingCode, floor.level, 'B' + targetRoom.number);
      }
    }
    
    return coords;
  }, [buildingCode, floor.level, targetRoom]);
  
  // Check if room was found in the data
  const roomFound = targetRoomCoords !== null;

  // Get source image dimensions when image loads
  React.useEffect(() => {
    if (floor.mapImage) {
      try {
        const imageSource = Image.resolveAssetSource(floor.mapImage);
        // Image.resolveAssetSource may include width and height directly
        if (imageSource && imageSource.width && imageSource.height) {
          setImageSize({ width: imageSource.width, height: imageSource.height });
        } else if (imageSource && imageSource.uri) {
          // Try to get size from URI (works for remote images)
          Image.getSize(
            imageSource.uri,
            (width, height) => {
              setImageSize({ width, height });
            },
            (error) => {
              console.warn('Failed to get image size, using container dimensions as fallback:', error);
              // Will use container dimensions as fallback in marker calculation
            }
          );
        } else {
          // Fallback: will use container dimensions
          console.warn('Could not determine image size, using container-based calculation');
        }
      } catch (error) {
        console.warn('Error resolving image source:', error);
      }
    }
  }, [floor.mapImage]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerLayout({ width, height });
  };

  // Handle tap on floor plan to set starting position
  const handleFloorPlanPress = (event: any) => {
    if (!containerLayout) return;
    
    const { locationX, locationY } = event.nativeEvent;
    setStartPosition({ x: locationX, y: locationY });
    setShowNavigation(true);
  };

  // Calculate hallway-following path from start to target room
  const navigationPath = useMemo(() => {
    if (!startPosition || !targetRoomCoords || !containerLayout || !imageSize) return null;

    const containerWidth = containerLayout.width;
    const containerHeight = containerLayout.height;
    
    let actualImageWidth: number;
    let actualImageHeight: number;
    let imageOffsetX: number;
    let imageOffsetY: number;
    
    const imageAspectRatio = imageSize.width / imageSize.height;
    const containerAspectRatio = containerWidth / containerHeight;
    
    if (imageAspectRatio > containerAspectRatio) {
      actualImageWidth = containerWidth;
      actualImageHeight = containerWidth / imageAspectRatio;
      imageOffsetX = 0;
      imageOffsetY = (containerHeight - actualImageHeight) / 2;
    } else {
      actualImageWidth = containerHeight * imageAspectRatio;
      actualImageHeight = containerHeight;
      imageOffsetX = (containerWidth - actualImageWidth) / 2;
      imageOffsetY = 0;
    }
    
    const targetX = imageOffsetX + (targetRoomCoords[0] * actualImageWidth);
    const targetY = imageOffsetY + (targetRoomCoords[1] * actualImageHeight);
    
    // Calculate hallway-following path (L-shaped or U-shaped routing)
    // Strategy: Route through hallways by going horizontally first, then vertically (or vice versa)
    // Find the nearest hallway point for start and end positions
    
    // Estimate hallway positions (typically in the center or between room rows)
    // For simplicity, we'll route to a hallway point, then to destination
    const hallwayY = imageOffsetY + (actualImageHeight * 0.5); // Middle of floor (typical hallway)
    const hallwayX = imageOffsetX + (actualImageWidth * 0.5); // Middle of floor (typical hallway)
    
    // Project start and end to nearest hallway
    const startToHallwayX = { x: startPosition.x, y: hallwayY };
    const hallwayToEndY = { x: targetX, y: hallwayY };
    
    // Alternative: vertical-first routing
    const startToHallwayY = { x: hallwayX, y: startPosition.y };
    const hallwayToEndX = { x: hallwayX, y: targetY };
    
    // Choose the shorter path (horizontal-first vs vertical-first)
    const horizontalFirstDistance = 
      Math.abs(startPosition.y - hallwayY) + 
      Math.abs(startPosition.x - targetX) + 
      Math.abs(hallwayY - targetY);
    
    const verticalFirstDistance = 
      Math.abs(startPosition.x - hallwayX) + 
      Math.abs(startPosition.y - targetY) + 
      Math.abs(hallwayX - targetX);
    
    let waypoints: Array<{ x: number; y: number }>;
    
    if (horizontalFirstDistance <= verticalFirstDistance) {
      // Horizontal-first: go to hallway horizontally, then to target
      waypoints = [
        { x: startPosition.x, y: startPosition.y },
        { x: startPosition.x, y: hallwayY },
        { x: targetX, y: hallwayY },
        { x: targetX, y: targetY },
      ];
    } else {
      // Vertical-first: go to hallway vertically, then to target
      waypoints = [
        { x: startPosition.x, y: startPosition.y },
        { x: hallwayX, y: startPosition.y },
        { x: hallwayX, y: targetY },
        { x: targetX, y: targetY },
      ];
    }
    
    return {
      waypoints,
      startX: startPosition.x,
      startY: startPosition.y,
      endX: targetX,
      endY: targetY,
    };
  }, [startPosition, targetRoomCoords, containerLayout, imageSize]);

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
            {targetRoom && roomFound && (
              <Text style={styles.instructionText}>
                Tap on the floor plan to set your starting position
              </Text>
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
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleFloorPlanPress}
          style={[styles.floorPlanContainer, { transform: [{ scale }] }]}
          onLayout={handleContainerLayout}
        >
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

          {/* Room Marker - Only show if room coordinates found */}
          {targetRoom && targetRoomCoords && containerLayout && (() => {
            // Convert normalized coordinates [0-1] to actual pixel positions
            // Account for image position within container (for resizeMode="contain")
            const containerWidth = containerLayout.width;
            const containerHeight = containerLayout.height;
            
            let actualImageWidth: number;
            let actualImageHeight: number;
            let imageOffsetX: number;
            let imageOffsetY: number;
            
            if (imageSize) {
              // Calculate actual image dimensions within container (with contain mode)
              const imageAspectRatio = imageSize.width / imageSize.height;
              const containerAspectRatio = containerWidth / containerHeight;
              
              if (imageAspectRatio > containerAspectRatio) {
                // Image is wider - fit to width
                actualImageWidth = containerWidth;
                actualImageHeight = containerWidth / imageAspectRatio;
                imageOffsetX = 0;
                imageOffsetY = (containerHeight - actualImageHeight) / 2;
              } else {
                // Image is taller - fit to height
                actualImageWidth = containerHeight * imageAspectRatio;
                actualImageHeight = containerHeight;
                imageOffsetX = (containerWidth - actualImageWidth) / 2;
                imageOffsetY = 0;
              }
            } else {
              // Fallback: assume image fills container (will be slightly off but better than nothing)
              actualImageWidth = containerWidth;
              actualImageHeight = containerHeight;
              imageOffsetX = 0;
              imageOffsetY = 0;
            }
            
            // Calculate marker position based on image bounds
            const markerX = imageOffsetX + (targetRoomCoords[0] * actualImageWidth);
            const markerY = imageOffsetY + (targetRoomCoords[1] * actualImageHeight);
            
            return (
              <View
                style={[
                  styles.roomMarker,
                  {
                    left: markerX,
                    top: markerY,
                  },
                ]}
              >
                <View style={styles.markerDot} />
                <Text style={styles.roomLabel}>
                  {targetRoom.number}
                </Text>
              </View>
            );
          })()}
          
          {/* Room Not Found Message */}
          {targetRoom && !roomFound && (
            <View style={styles.notFoundContainer}>
              <Text style={styles.notFoundText}>
                Room {targetRoom.number} not found
              </Text>
              <Text style={styles.notFoundSubtext}>
                This room is not available in the floor plan data
              </Text>
            </View>
          )}

          {/* Navigation Path - Multi-segment hallway routing */}
          {showNavigation && navigationPath && navigationPath.waypoints && navigationPath.waypoints.length > 1 && (
            <>
              {navigationPath.waypoints.slice(0, -1).map((waypoint, index) => {
                const nextWaypoint = navigationPath.waypoints[index + 1];
                const dx = nextWaypoint.x - waypoint.x;
                const dy = nextWaypoint.y - waypoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                
                return (
                  <View
                    key={index}
                    style={[
                      styles.pathLine,
                      {
                        left: waypoint.x,
                        top: waypoint.y,
                        width: distance,
                        transform: [{ rotate: `${angle}deg` }],
                      },
                    ]}
                  />
                );
              })}
            </>
          )}

          {/* Starting Position Marker */}
          {startPosition && (
            <View
              style={[
                styles.startMarker,
                {
                  left: startPosition.x - 10,
                  top: startPosition.y - 10,
                },
              ]}
            >
              <View style={styles.startMarkerDot} />
              <Text style={styles.startMarkerLabel}>You are here</Text>
            </View>
          )}
        </TouchableOpacity>
      </GestureScrollView>


      {/* Navigation Controls */}
      <View style={styles.navigationControls}>
        <TouchableOpacity
          style={[styles.navButton, !startPosition && styles.navButtonDisabled, { marginRight: 10 }]}
          onPress={() => {
            setStartPosition(null);
            setShowNavigation(false);
          }}
          disabled={!startPosition}
        >
          <Text style={[styles.navButtonText, !startPosition && styles.navButtonTextDisabled]}>
            Clear Route
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, !startPosition && styles.navButtonDisabled]}
          onPress={() => setShowNavigation(!showNavigation)}
          disabled={!startPosition}
        >
          <Text style={[styles.navButtonText, !startPosition && styles.navButtonTextDisabled]}>
            {showNavigation ? 'Hide' : 'Show'} Path
          </Text>
        </TouchableOpacity>
      </View>

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
  instructionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
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
  roomMarker: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  roomLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '600',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  notFoundContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    marginTop: -40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundSubtext: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  pathLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#007AFF',
    borderTopWidth: 1,
    borderTopColor: '#0051D5',
    borderBottomWidth: 1,
    borderBottomColor: '#0051D5',
    transformOrigin: 'left center',
    zIndex: 50,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  startMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 60,
  },
  startMarkerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  startMarkerLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  navigationControls: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    flexDirection: 'row',
  },
  navButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  navButtonDisabled: {
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },
  navButtonTextDisabled: {
    color: '#999',
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

