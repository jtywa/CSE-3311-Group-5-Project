// Building directory for UTA Campus
// Coordinates verified and updated for accurate positioning

export type Room = {
  number: string;      // e.g., "B22"
  x: number;          // position on floor plan image (0-100%)
  y: number;          // position on floor plan image (0-100%)
  name?: string;      // optional room name/type
};

export type Floor = {
  level: string;      // "B" for basement, "1", "2", etc.
  name: string;       // "Basement", "First Floor", etc.
  mapImage?: any;     // require() reference to floor plan image
  rooms?: Room[];
};

export type Building = {
  code: string;       // e.g., "NH"
  name: string;       // e.g., "Nedderman Hall"
  lat: number;
  lon: number;
  aliases?: string[]; // optional extra search tokens
  floors?: Floor[];   // optional floor plans with rooms
};

export const BUILDINGS: Building[] = [
  // Updated with accurate GeoJSON coordinates
  { 
    code: 'NH', 
    name: 'Nedderman Hall', 
    lat: 32.732497072578525, 
    lon: -97.11384254666201, 
    aliases: ['Nedderman', 'Nedderman Hall', 'NH'],
  },
  { code: 'ERB',  name: 'Engineering Research Building', lat: 32.73309497916678,  lon: -97.11239587034484, aliases: ['Engineering Research', 'Research'] },
  { code: 'COBA', name: 'Business Building',             lat: 32.7297063651245,   lon: -97.11064793176776, aliases: ['Business', 'COBA'] },
  { code: 'ARB',  name: 'Aerodynamics Research Building', lat: 32.727535535084584, lon: -97.10725791443757, aliases: ['Aerodynamics', 'Aerospace Research'] },
  { code: 'CMPC', name: 'Campus Center',                 lat: 32.73213271544762,  lon: -97.11600962538355, aliases: ['Campus Center', 'Student Center'] },
  { code: 'ARCH', name: 'CAPPA Building',                lat: 32.73134241092643,  lon: -97.11609424505932, aliases: ['CAPPA', 'Architecture', 'Design'] },
  { code: 'CARH', name: 'Carlisle Hall',                 lat: 32.730675161301136, lon: -97.11254551373723, aliases: ['Carlisle', 'Carlisle Hall'] },
  { code: 'CPB',  name: 'Chemistry & Physics Building',  lat: 32.73041688330311,  lon: -97.11174685369691, aliases: ['Chemistry', 'Physics', 'CPB'] },
  { code: 'CRB',  name: 'Chemistry Research Building',   lat: 32.730445260439424, lon: -97.11278944833359, aliases: ['Chemistry Research', 'CRB'] },
  { code: 'CELB', name: 'Civil Engineering Lab Building', lat: 32.727600738280174, lon: -97.12559849477408, aliases: ['Civil', 'Civil Engineering', 'CELB'] },
  { code: 'CHL', name: 'College Hall',                    lat: 32.73081537383048, lon: -97.11151431219628, aliases: ['College', 'College Hall','CHL'] },
  { code: 'CPC', name: 'College Park Center',             lat: 32.730433113633794, lon: -97.10810572037988, aliases: ['College Park', 'College Park Center','CPC'] },
  { code: 'CEWF', name: 'Continuing education/workforce development', lat: 32.726856560155966, lon: -97.10848629551575, aliases: ['Continuing education', 'Workforce development', 'CEWF'] },
  { code: 'CEEI', name: 'Center For Entrepreneurship And Technology Development', lat: 32.73199558421942, lon: -97.10824425181892, aliases: ['Entrepreneurship', 'Technology development', 'CEEI'] },
  { code: 'EES', name: 'Earth and Environmental Science', lat: 32.7316320789856, lon: -97.11415142464146, aliases: ['Earth and Environmental Science', 'EES'] },
  { code: 'DED', name: 'DED Technical Training', lat: 32.73199558421942, lon: -97.10824425181892, aliases: ['DED', 'Technical Training', 'DED'] },
  { code: 'ELAB', name: 'Engineering Lab Building', lat: 32.732359162458096, lon: -97.11265905626017, aliases: ['Engineering Lab', 'ELAB'] },
  { code: 'ERB', name: 'Engineering Research Building', lat: 32.73308033897969, lon: -97.11241804357154, aliases: ['Engineering Research', 'ERB'] }, 
  { code: 'EH', name: 'Environmental Health and Safety', lat: 32.73229395705937, lon: -97.12207038527791, aliases: ['Environmental Health', 'EH'] },
  { code: 'FAAA', name: 'Finance and Administration Annex', lat: 32.737013558311006, lon: -97.10925313539948, aliases: ['Finance', 'Administration', 'Finance and Administration Annex', 'FAAA'] },
  { code: 'FAB', name: 'Fine Arts Building', lat: 32.73106772775169, lon: -97.1151098569389, aliases: ['Fine Arts', 'Art', 'Music', 'FAB'] },
  { code: 'GACB', name: 'General Academic Classroom Building ', lat: 32.734287758415476, lon: -97.11415714626568, aliases: ['General Academic Classroom Building', 'GACB'] },
  { code: 'HH', name: 'Hammond Hall', lat: 32.729713912075724, lon: -97.11187530005763, aliases: ['Hammond', 'Hammond Hall', 'HH'] },
  { code: 'KC', name: 'Kalpana Chawla Hall', lat: 32.72834371466213, lon: -97.10944391955381, aliases: ['Kalpana Chawla', 'Kalpana Chawla Hall', 'KC'] },
  { code: 'LIBR', name: 'Library', lat: 32.72972411975715, lon: -97.11294011457005, aliases: ['Library', 'LIBR'] },   
  { code: 'LCDO', name: 'Library Coll Dep & OIT Office', lat: 32.72777778181056, lon: -97.12414903722026, aliases: ['Library Coll Dep', 'OIT Office', 'LCDO'] },
  { code: 'LS', name: 'Life Science Building', lat: 32.72878491793314, lon: -97.11277634024366, aliases: ['Life Science', 'LSB'] },
  { code: 'MAC', name: 'Maverick Activities Center', lat: 32.73193058827242, lon: -97.11747717517895, aliases: ['Maverick Activities Center', 'MAC'] },
  { code: 'STAD', name: 'Maverick Stadium', lat: 32.72920800430619, lon: -97.12648736063714, aliases: ['Maverick Stadium', 'STAD'] },
  { code: 'PATS', name: 'Parking & Transportation Services', lat: 32.72944264986819, lon: -97.12441808853369, aliases: ['Parking', 'Transportation', 'PATS'] },
  { code: 'PE', name: 'Physical Education', lat: 32.73095247602866, lon: -97.11764698876084, aliases: ['Physical Education', 'PE'] },
  { code: 'PK', name: 'Pickard Hall', lat: 32.7288903836658, lon: -97.11147047359728, aliases: ['Pickard', 'Pickard Hall', 'PK'] }, 
  { code: 'RH', name: 'Ransom Hall', lat: 32.730873015119386, lon: -97.11219414951734, aliases: ['Ransom', 'Ransom Hall', 'RAN'] },
  { code: 'PH', name: 'Preston Hall', lat: 32.730859251076836, lon: -97.11290706562441, aliases: ['Preston', 'Preston Hall', 'PH'] }, 
  { code: 'SEIR', name: 'Science Engineering Innovation & Research', lat: 32.72805959916336, lon: -97.11338957627018, aliases: ['Science Engineering Innovation & Research', 'SEIR'] },
  { code: 'SH', name: 'Science Hall', lat: 32.73067292881889, lon: -97.1141130304371, aliases: ['Science Lab', 'SLAB'] },
  { code: 'SWCA', name: 'Social Work Complex A', lat: 32.72763358931613, lon: -97.1116343140452, aliases: ['Social Work Center', 'SWC'] },
  { code: 'SWCB', name: 'Social Work Complex B', lat: 32.72763358931613, lon: -97.1116343140452, aliases: ['Social Work Center', 'SWC'] },
  { code: 'SAC', name: 'Studio Arts Center', lat: 32.7288683644021, lon: -97.12494799308858, aliases: ['Studio Arts', 'SAB'] },
  { code: 'SC', name: 'Swift Center', lat: 32.733808197055865, lon: -97.1210580761367, aliases: ['Swift', 'Swift Center', 'SC'] },
  { code: 'TEX', name: 'Texas Hall', lat: 32.72972923256842, lon: -97.11555994743937, aliases: ['Texas', 'Texas Hall', 'TEX'] },
  { code: 'TCOM', name: 'The Commons', lat: 32.732771243918464, lon: -97.1170695657907, aliases: ['The Commons', 'TCOM'] },
  { code: 'TRIM', name: 'Trimble Hall', lat: 32.72993369279452, lon: -97.11162800886322, aliases: ['Trimble', 'Trimble Hall', 'TRIM'] },
  { code: 'TRIN', name: 'Trinity Hall', lat: 32.73018504037576, lon: -97.11710370721082, aliases: ['Trinity', 'Trinity Hall', 'TRIN'] },
  { code: 'UAB', name: 'University Administration Building', lat: 32.72920916747137, lon: -97.11515872660294, aliases: ['University Administration', 'UAB'] },
  { code: 'UH', name: 'University Hall', lat: 32.729066656906696, lon: -97.11391711166853, aliases: ['University', 'University Hall', 'UH'] },
  { code: 'WET', name: 'Wetsel Service Center', lat: 32.72672991322905, lon: -97.12593922180436, aliases: ['Wetsel', 'Wetsel Service Center', 'WET'] },
  { code: 'WH', name: 'Woolf Hall', lat: 32.731561655332214, lon: -97.11264480135995, aliases: ['Woolf', 'Woolf Hall', 'WH'] },
];

// Helper function to find building by search query
export const findBuilding = (query: string, buildings: Building[]): Building | undefined => {
  const q = query.trim().toLowerCase();
  
  // Create index for faster lookups
  const index = new Map<string, Building>();
  for (const b of buildings) {
    index.set(b.code.toLowerCase(), b);
    index.set(b.name.toLowerCase(), b);
    (b.aliases || []).forEach(a => index.set(a.toLowerCase(), b));
  }

  // 1) exact code or name/alias match
  if (index.has(q)) return index.get(q);

  // 2) handle variants like "NH 110" -> try token[0] as code
  const firstToken = q.split(/\s+/)[0];
  if (index.has(firstToken)) return index.get(firstToken);

  // 3) fuzzy: startsWith / includes on code, name, aliases
  const candidates = buildings.filter(b => {
    const hay = [b.code, b.name, ...(b.aliases || [])].join(' ').toLowerCase();
    return hay.startsWith(q) || hay.includes(q);
  });
  return candidates[0];
};

// Parse room search query like "NH B22" or "Nedderman B22"
export type RoomSearchResult = {
  building: Building;
  floor: Floor;
  room: Room;
};

// Helper function to get floor name from level
const getFloorName = (level: string): string => {
  if (level === 'B') return 'Basement';
  const num = parseInt(level, 10);
  if (isNaN(num)) return `Floor ${level}`;
  const suffixes = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth'];
  return num < suffixes.length ? `${suffixes[num]} Floor` : `Floor ${level}`;
};

// Helper to get floor plan image
const getFloorPlanImageForFloor = (buildingCode: string, floorLevel: string): any => {
  try {
    const { getFloorPlanImage } = require('./floorPlanImages');
    return getFloorPlanImage(buildingCode, floorLevel);
  } catch {
    return undefined;
  }
};

export const findRoom = (query: string, buildings: Building[]): RoomSearchResult | undefined => {
  // Import room data loader dynamically to avoid circular dependencies
  const { getRoomCoordinates, hasBuildingData, hasFloor } = require('./roomDataLoader');
  const q = query.trim();
  
  // Try to parse patterns like "NH B22", "NH 110", "Nedderman B22", "NH110", "NHB22"
  const patterns = [
    /^([A-Z]+)\s+([A-Z]?\d+[A-Z]?)$/i,  // "NH B22", "NH 110"
    /^(.+?)\s+([A-Z]?\d+[A-Z]?)$/i,      // "Nedderman B22"
  ];
  
  for (const pattern of patterns) {
    const match = q.match(pattern);
    if (!match) continue;
    
    const [, buildingPart, roomNumber] = match;
    const building = findBuilding(buildingPart, buildings);
    
    if (!building) continue;
    
    // Determine the floor level from the room number
    // Room "110" -> floor "1", "210" -> floor "2", "B22" -> floor "B"
    const firstChar = roomNumber.charAt(0).toUpperCase();
    let targetFloorLevel = '';
    
    if (firstChar === 'B') {
      targetFloorLevel = 'B';  // Basement
    } else if (/\d/.test(firstChar)) {
      targetFloorLevel = firstChar; // "1" for 110, "2" for 210, etc.
    }
    
    if (!targetFloorLevel) continue;
    
    // Check if building has room data (even if floors aren't defined in marker.ts)
    const hasRoomData = hasBuildingData(building.code);
    const floorExistsInData = hasRoomData && hasFloor(building.code, targetFloorLevel);
    
    // Check if floor plan image exists (even if no room data)
    const { hasFloorPlanImage } = require('./floorPlanImages');
    const hasFloorPlan = hasFloorPlanImage(building.code, targetFloorLevel);
    
    // Try to find floor in building.floors first
    let targetFloor: Floor | undefined;
    if (building.floors) {
      targetFloor = building.floors.find(f => f.level === targetFloorLevel);
    }
    
    // If floor not found in building.floors, create it dynamically if:
    // 1. Floor exists in roomData, OR
    // 2. Floor plan image exists (even without room data)
    if (!targetFloor && (floorExistsInData || hasFloorPlan)) {
      // Try to get floor plan image if available
      const mapImage = getFloorPlanImageForFloor(building.code, targetFloorLevel);
      
      targetFloor = {
        level: targetFloorLevel,
        name: getFloorName(targetFloorLevel),
        mapImage: mapImage, // Will be undefined if image doesn't exist
      };
    }
    
    if (!targetFloor) continue;
    
    // Try to get coordinates from JSON data
    // For basement rooms, try both with and without "B" prefix since data format varies
    let jsonCoords = getRoomCoordinates(building.code, targetFloorLevel, roomNumber);
    let finalRoomNumber = roomNumber; // Use variable to allow modification
    
    // If not found and it's a basement room, try without "B" prefix (e.g., "B22" -> "22")
    if (!jsonCoords && targetFloorLevel === 'B' && roomNumber.startsWith('B')) {
      const roomWithoutB = roomNumber.substring(1);
      jsonCoords = getRoomCoordinates(building.code, targetFloorLevel, roomWithoutB);
      if (jsonCoords) {
        // Update finalRoomNumber to match what's in the data
        finalRoomNumber = roomWithoutB;
      }
    }
    
    // Also try with "B" prefix if searching without it (e.g., "22" -> "B22")
    if (!jsonCoords && targetFloorLevel === 'B' && !roomNumber.startsWith('B')) {
      const roomWithB = 'B' + roomNumber;
      jsonCoords = getRoomCoordinates(building.code, targetFloorLevel, roomWithB);
      if (jsonCoords) {
        // Update finalRoomNumber to match what's in the data
        finalRoomNumber = roomWithB;
      }
    }
    
    // If coordinates found OR floor plan exists (even without room data), create room object
    // This allows searching for rooms on floors that have floor plans but no room data yet
    if (jsonCoords || floorExistsInData || hasFloorPlan) {
      const placeholderRoom: Room = {
        number: finalRoomNumber,
        x: jsonCoords ? jsonCoords[0] * 100 : 50, // Convert from 0-1 to 0-100%
        y: jsonCoords ? jsonCoords[1] * 100 : 50,
        name: 'Room'
      };
      return { building, floor: targetFloor, room: placeholderRoom };
    }
    
    // Fallback: if building has floors defined, search through them
    if (building.floors) {
      for (const floor of building.floors) {
        if (floor.level !== targetFloorLevel) continue;
        if (!floor.rooms) continue;
        
        const room = floor.rooms.find(r => 
          r.number.toLowerCase() === roomNumber.toLowerCase()
        );
        
        if (room) {
          return { building, floor, room };
        }
      }
    }
  }
  
  return undefined;
};
