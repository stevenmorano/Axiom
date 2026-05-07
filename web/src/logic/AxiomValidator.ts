import { Tile, GridState, ConstraintRule, ConstraintType, getTileValue } from './AxiomModels';

export class AxiomValidator {
    
    // Validates a fully-populated 25-tile grid against an array of rules.
    public static isGridValid(grid: GridState, rules: ConstraintRule[]): boolean {
        // Automatically false if grid is incomplete
        if (grid.includes(null)) return false;

        for (const rule of rules) {
            if (!this.evaluateRule(grid as Tile[], rule)) {
                return false;
            }
        }
        return true;
    }

    public static evaluateRule(grid: Tile[], rule: ConstraintRule): boolean {
        const line = rule.isRow ? this.getRow(grid, rule.targetIndex) : this.getCol(grid, rule.targetIndex);

        switch (rule.type) {
            case ConstraintType.SumToTarget:
                const sum = line.reduce((acc, tile) => acc + getTileValue(tile), 0);
                return sum === (rule.targetValue as number);
            
            case ConstraintType.ContainsChar:
                return line.includes(rule.targetValue as Tile);
                
            case ConstraintType.ExcludeChar:
                return !line.includes(rule.targetValue as Tile);

            case ConstraintType.UniqueElements:
                const uniqueSet = new Set(line);
                return uniqueSet.size === line.length;

            default:
                return false;
        }
    }

    private static getRow(grid: Tile[], rowIndex: number): Tile[] {
        const start = rowIndex * 5;
        return grid.slice(start, start + 5);
    }

    private static getCol(grid: Tile[], colIndex: number): Tile[] {
        return [0, 1, 2, 3, 4].map(row => grid[row * 5 + colIndex]);
    }
}
