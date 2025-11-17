// Floor plan image mappings
// Maps building code + floor level to require() image paths
// Note: All images must be PNG or JPG format (not PDF)

type FloorPlanImageMap = Record<string, Record<string, any>>;

const floorPlanImages: FloorPlanImageMap = {
  NH: {
    B: require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/NH/NHB-1.png'),
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/NH/NH1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/NH/NH2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/NH/NH3_Rotated-1.png'),
    '4': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/NH/NH4_Rotated-1.png'),
    '5': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/NH/NH5-1.png'),
    '6': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/NH/NH6_Rotated-1.png'),
  },
  COBA: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/COBA/COBA1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/COBA/COBA2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/COBA/COBA3-1.png'),
  },
  WH: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/WH/WH1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/WH/WH2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/WH/WH3-1.png'),
    '4': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/WH/WH4-1.png'),
  },
  UH: {
    B: require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/UH/UHB-1.png'),
  },
  SWSH: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SWSH/SWSH1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SWSH/SWSH2_Rotated-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SWSH/SWSH3-1.png'),
    '4': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SWSH/SWSH4-1.png'),
  },
  SH: {
    B: require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SH/SHB-1.png'),
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SH/SH1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SH/SH2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SH/SH3-1.png'),
  },
  SEIR: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/SEIR/SEIR1-1.png'),
  },
  PKH: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PKH/PKH1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PKH/PKH2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PKH/PKH3-1.png'),
    '4': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PKH/PKH4-1.png'),
    '5': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PKH/PKH5-1.png'),
    '6': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PKH/PKH6-1.png'),
  },
  PH: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PH/PH1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PH/PH2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/PH/PH3-1.png'),
  },
  LS: {
    B: require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/LS/LSB-1.png'),
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/LS/LS1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/LS/LS2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/LS/LS3-1.png'),
    '4': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/LS/LS4-1.png'),
  },
  GS: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/GS/GS1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/GS/GS2-1.png'),
  },
  ERB: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ERB/ERB1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ERB/ERB2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ERB/ERB3-1.png'),
    '4': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ERB/ERB4-1.png'),
    '5': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ERB/ERB5-1.png'),
    '6': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ERB/ERB6-1.png'),
  },
  ELB: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ELB/ELB1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ELB/ELB2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/ELB/ELB3-1.png'),
  },
  CPB: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/CPB/CPB1-1.png'),
    '2': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/CPB/CPB2-1.png'),
    '3': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/CPB/CPB3-1.png'),
  },
  CH: {
    '1': require('../images/floor-plans/UTA Map PDFs/UTA Map PDFs/CH/CH1-1.png'),
  },
};

/**
 * Get floor plan image for a building and floor level
 * Returns undefined if image doesn't exist
 */
export const getFloorPlanImage = (
  buildingCode: string,
  floorLevel: string
): any => {
  const building = floorPlanImages[buildingCode.toUpperCase()];
  if (!building) return undefined;
  
  return building[floorLevel.toUpperCase()];
};

/**
 * Check if a floor plan image exists for a building and floor
 */
export const hasFloorPlanImage = (
  buildingCode: string,
  floorLevel: string
): boolean => {
  return getFloorPlanImage(buildingCode, floorLevel) !== undefined;
};

