export type Tile = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const ALL_TILES: Tile[] = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F'
];

export type GridState = (Tile | null)[]; // Flat 25-element array representing 5x5 Grid

export enum ConstraintType {
    SumToTarget = 'SumToTarget',       // e.g., Row 1 must sum to exactly N (Letters A-F have hex values 10-15)
    ContainsChar = 'ContainsChar',     // e.g., Col 3 must contain 'F'
    UniqueElements = 'UniqueElements', // e.g., Row 2 must have all unique tiles
    ExcludeChar = 'ExcludeChar'        // e.g., Col 1 must NOT contain '9'
}

export interface ConstraintRule {
    id: string;
    type: ConstraintType;
    targetIndex: number; // 0-4 (Row or Col index depending on isRow)
    isRow: boolean;
    targetValue?: number | string; // Numeric sum target, or String char target
}

// Map characters to mathematical hex values (A=10, F=15)
export const getTileValue = (tile: Tile): number => {
    return parseInt(tile, 16);
};
