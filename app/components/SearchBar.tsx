import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BUILDINGS, findRoom, type Building, type RoomSearchResult } from '../../assets/map asset/marker';

interface SearchBarProps {
  onBuildingFound: (building: Building) => void;
  onRoomFound?: (result: RoomSearchResult) => void;
  onSearchSubmit: () => void;
}

export default function SearchBar({ onBuildingFound, onRoomFound, onSearchSubmit }: SearchBarProps) {
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
        
        // Try with each building that has floors
        for (const building of BUILDINGS) {
          if (!building.floors) continue;
          
          // Determine floor from room number
          const firstChar = q.charAt(0).toUpperCase();
          let targetFloorLevel = '';
          
          if (firstChar === 'B') {
            targetFloorLevel = 'B';
          } else if (/\d/.test(firstChar)) {
            targetFloorLevel = firstChar;
          }
          
          if (targetFloorLevel) {
            const targetFloor = building.floors.find(f => f.level === targetFloorLevel);
            if (targetFloor) {
              const placeholderRoom: any = {
                number: capitalizedRoom,
                x: 50,
                y: 50,
                name: 'Room'
              };
              roomResult = { building, floor: targetFloor, room: placeholderRoom };
              break;
            }
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

  return (
    <View style={styles.container}>
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
  searchBar: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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

