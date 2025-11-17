import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BUILDINGS, findRoom, type Building, type RoomSearchResult } from '../../assets/map asset/marker';

interface SearchBarProps {
  onBuildingFound: (building: Building) => void;
  onRoomFound?: (result: RoomSearchResult) => void;
  onSearchSubmit: () => void;
  onClear?: () => void;
}

export default function SearchBar({ onBuildingFound, onRoomFound, onSearchSubmit, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Building[]>([]);
  const [roomSuggestions, setRoomSuggestions] = useState<RoomSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setRoomSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const q = query.trim();
    const qLower = q.toLowerCase();
    
    // Check if query looks like a room search (e.g., "NH B22", "NH 110", "NH110", "b22", "B22")
    const roomPatterns = [
      /^([A-Z]+)\s+([A-Z]?\d+[A-Z]?)$/i,  // "NH B22", "NH 110" (with space)
      /^([A-Z]+)([A-Z]?\d+[A-Z]?)$/i,     // "NH110", "NHB22" (no space)
      /^([A-Z]?\d+[A-Z]?)$/i,              // "B22", "110", "b22" (just room number)
    ];
    
    let isRoomSearch = false;
    let isJustRoomNumber = false;
    
    for (let i = 0; i < roomPatterns.length; i++) {
      if (roomPatterns[i].test(q)) {
        isRoomSearch = true;
        isJustRoomNumber = (i === 2); // third pattern is just room number
        break;
      }
    }

    if (isRoomSearch) {
      let roomResult: RoomSearchResult | undefined;
      
      if (isJustRoomNumber) {
        // Just room number like "b22" or "B22" - search across all buildings
        const capitalizedRoom = q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
        
        // Import room data loader to check for room data
        const { hasBuildingData, hasFloor, getFloorRooms, getRoomCoordinates } = require('../../assets/map asset/roomDataLoader');
        
        // Try with each building (check both floors and room data)
        for (const building of BUILDINGS) {
          // Determine floor from room number
          const firstChar = q.charAt(0).toUpperCase();
          let targetFloorLevel = '';
          let searchRoomNumber = capitalizedRoom;
          
          if (firstChar === 'B') {
            targetFloorLevel = 'B';
          } else if (/\d/.test(firstChar)) {
            targetFloorLevel = firstChar;
          }
          
          if (!targetFloorLevel) continue;
          
          // Check if building has floor data (either in floors, roomData, or floor plan images)
          let targetFloor = building.floors?.find(f => f.level === targetFloorLevel);
          const hasRoomData = hasBuildingData(building.code);
          const floorExistsInData = hasRoomData && hasFloor(building.code, targetFloorLevel);
          
          // Check if floor plan image exists (even if no room data)
          const { hasFloorPlanImage } = require('../../assets/map asset/floorPlanImages');
          const hasFloorPlan = hasFloorPlanImage(building.code, targetFloorLevel);
          
          // For basement rooms, try to find the room in the data (handles both "B22" and "22" formats)
          let foundRoom = false;
          if (targetFloorLevel === 'B' && hasRoomData) {
            // Try with "B" prefix first
            if (getRoomCoordinates(building.code, 'B', searchRoomNumber)) {
              foundRoom = true;
            } else if (searchRoomNumber.startsWith('B')) {
              // Try without "B" prefix
              const roomWithoutB = searchRoomNumber.substring(1);
              if (getRoomCoordinates(building.code, 'B', roomWithoutB)) {
                searchRoomNumber = roomWithoutB;
                foundRoom = true;
              }
            } else {
              // Try with "B" prefix
              const roomWithB = 'B' + searchRoomNumber;
              if (getRoomCoordinates(building.code, 'B', roomWithB)) {
                searchRoomNumber = roomWithB;
                foundRoom = true;
              }
            }
          }
          
          // If floor doesn't exist in building.floors, create it if:
          // 1. Floor exists in roomData, OR
          // 2. Floor plan image exists (even without room data)
          if (!targetFloor && (floorExistsInData || hasFloorPlan)) {
            const floorName = targetFloorLevel === 'B' ? 'Basement' : 
              ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'][parseInt(targetFloorLevel)] + ' Floor';
            targetFloor = {
              level: targetFloorLevel,
              name: floorName,
            };
          }
          
          if (targetFloor || floorExistsInData || hasFloorPlan || foundRoom) {
            const placeholderRoom: any = {
              number: searchRoomNumber,
              x: 50,
              y: 50,
              name: 'Room'
            };
            roomResult = { building, floor: targetFloor || { level: targetFloorLevel, name: `Floor ${targetFloorLevel}` }, room: placeholderRoom };
            break;
          }
        }
      } else {
        // Building code + room pattern
        let normalizedQuery = q;
        
        // If no space exists, add one: "NHB22" -> "NH B22" or "NH110" -> "NH 110"
        if (!q.includes(' ')) {
          normalizedQuery = q.replace(/([A-Z]+)([A-Z]?\d+)/i, (match, building, room) => {
            // If room starts with B (basement), keep it as "B22"
            if (/^B/i.test(room)) {
              return `${building} B${room.substring(1)}`;
            }
            // Otherwise, just add space: "NH110" -> "NH 110"
            return `${building} ${room}`;
          });
        }
        
        roomResult = findRoom(normalizedQuery, BUILDINGS);
      }
      
      if (roomResult) {
        setRoomSuggestions([roomResult]);
        setSuggestions([]);
        setShowSuggestions(true);
        return;
      }
    }

    // Regular building search - show buildings first
    const matches = BUILDINGS.filter(building => {
      const searchableText = [
        building.code,
        building.name,
        ...(building.aliases || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(qLower);
    }).slice(0, 5); // Limit to 5 suggestions

    setSuggestions(matches);
    setRoomSuggestions([]);
    setShowSuggestions(matches.length > 0);
  }, [query]);

  const handleSelectBuilding = (building: Building) => {
    setQuery(`${building.code} - ${building.name}`);
    setShowSuggestions(false);
    onBuildingFound(building);
    Keyboard.dismiss();
  };

  const handleSelectRoom = (result: RoomSearchResult) => {
    setQuery(`${result.building.code} ${result.room.number}`);
    setShowSuggestions(false);
    if (onRoomFound) {
      onRoomFound(result);
    }
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    if (roomSuggestions.length > 0) {
      handleSelectRoom(roomSuggestions[0]);
    } else if (suggestions.length > 0) {
      handleSelectBuilding(suggestions[0]);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setRoomSuggestions([]);
    setShowSuggestions(false);
    Keyboard.dismiss();
    if (onClear) {
      onClear();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search building or room (e.g., NH, NH110)…"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          placeholderTextColor="#888"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && (
        <ScrollView 
          style={styles.suggestionsContainer}
          keyboardShouldPersistTaps="handled"
        >
          {roomSuggestions.map((result) => (
            <TouchableOpacity
              key={`${result.building.code}-${result.room.number}`}
              style={styles.suggestionItem}
              onPress={() => handleSelectRoom(result)}
            >
              <View style={styles.suggestionContent}>
                <Text style={styles.buildingCode}>
                  🚪 {result.building.code} {result.room.number}
                </Text>
                <Text style={styles.buildingName}>
                  {result.building.name} - {result.floor.name}
                </Text>
                {result.room.name && (
                  <Text style={styles.roomType}>{result.room.name}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {suggestions.map((building) => (
            <TouchableOpacity
              key={`${building.code}-${building.lat}`}
              style={styles.suggestionItem}
              onPress={() => handleSelectBuilding(building)}
            >
              <View style={styles.suggestionContent}>
                <Text style={styles.buildingCode}>🏢 {building.code}</Text>
                <Text style={styles.buildingName}>{building.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 15,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    padding: 15,
  },
  buildingCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  buildingName: {
    fontSize: 14,
    color: '#333',
  },
  roomType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

