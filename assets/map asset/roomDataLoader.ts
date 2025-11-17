// Room data loader utility
import { roomData as roomDataJson } from './roomData';

export type RoomCoordinate = [number, number]; // [x, y] normalized 0-1
export type RoomData = {
  pdf_path: string;
  rooms: Record<string, RoomCoordinate>;
};

export type BuildingRoomData = Record<string, RoomData>;

// Load room data
export const getRoomData = (): Record<string, BuildingRoomData> => {
  return roomDataJson as Record<string, BuildingRoomData>;
};

// Get room coordinates for a specific building, floor, and room
export const getRoomCoordinates = (
  buildingCode: string,
  floorLevel: string,
  roomNumber: string
): RoomCoordinate | null => {
  const roomData = getRoomData();
  const building = roomData[buildingCode];
  
  if (!building) return null;
  
  const floor = building[floorLevel];
  if (!floor || !floor.rooms) return null;
  
  // Try exact match first
  if (floor.rooms[roomNumber]) {
    return floor.rooms[roomNumber];
  }
  
  // Try case-insensitive match
  const roomKey = Object.keys(floor.rooms).find(
    key => key.toLowerCase() === roomNumber.toLowerCase()
  );
  
  return roomKey ? floor.rooms[roomKey] : null;
};

// Get all rooms for a specific building and floor
export const getFloorRooms = (
  buildingCode: string,
  floorLevel: string
): Record<string, RoomCoordinate> | null => {
  const roomData = getRoomData();
  const building = roomData[buildingCode];
  
  if (!building) return null;
  
  const floor = building[floorLevel];
  return floor?.rooms || null;
};

// Check if a building has room data
export const hasBuildingData = (buildingCode: string): boolean => {
  const roomData = getRoomData();
  return buildingCode in roomData;
};

// Get PDF path for a building floor
export const getFloorPdfPath = (buildingCode: string, floorLevel: string): string | null => {
  const roomData = getRoomData();
  const building = roomData[buildingCode];
  
  if (!building) return null;
  
  const floor = building[floorLevel];
  return floor?.pdf_path || null;
};

// Get available floor levels for a building
export const getBuildingFloors = (buildingCode: string): string[] | null => {
  const roomData = getRoomData();
  const building = roomData[buildingCode];
  
  if (!building) return null;
  
  return Object.keys(building);
};

// Check if a specific floor exists for a building
export const hasFloor = (buildingCode: string, floorLevel: string): boolean => {
  const roomData = getRoomData();
  const building = roomData[buildingCode];
  
  if (!building) return false;
  
  return floorLevel in building;
};

