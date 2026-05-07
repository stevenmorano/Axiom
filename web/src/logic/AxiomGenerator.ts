import seedrandom from 'seedrandom';
import { Tile, ALL_TILES, ConstraintRule, ConstraintType, GridState, getTileValue } from './AxiomModels';
import { AxiomValidator } from './AxiomValidator';

export interface GeneratedDailyPuzzle {
    seed: string;
    targetBoard: Tile[];
    rules: ConstraintRule[];
    givenStartingTiles: Partial<Record<number, Tile>>; // Keys are index (0-24), values are specific Tiles pinned in place.
    playerBank: Tile[]; // The pool of tiles the player must drag/swap onto the board.
}

export class AxiomGenerator {
    
    public static generateDailyPuzzle(dateString: string): GeneratedDailyPuzzle {
        // Initialize deterministic random generator based on the date seed
        const prng = seedrandom(dateString);

        // 1. Generate Target Board
        // Pick 25 tiles randomly from the ALL_TILES pool (allowing duplicates like a real puzzle)
        const targetBoard: Tile[] = [];
        for (let i = 0; i < 25; i++) {
            const rIndex = Math.floor(prng() * ALL_TILES.length);
            targetBoard.push(ALL_TILES[rIndex]);
        }

        // 2. Generate Deterministic Rules that the Target Board inherently passes
        const rules: ConstraintRule[] = [];
        let ruleCounter = 0;

        // Generate exactly 10 rules (1 for every row and every column)
        for (let row = 0; row < 5; row++) {
            rules.push(this.generateRandomRuleForLine(targetBoard, true, row, ++ruleCounter, prng));
        }
        for (let col = 0; col < 5; col++) {
            rules.push(this.generateRandomRuleForLine(targetBoard, false, col, ++ruleCounter, prng));
        }

        // 3. Define "Given" Pre-Filled Tiles to reduce combination-chaos and lock the player's path
        // For a 5x5, we might pre-fill 10 random tiles so the player only solves the remaining 15.
        const givenStartingTiles: Partial<Record<number, Tile>> = {};
        const availableIndexes = Array.from({length: 25}, (_, i) => i);
        
        // Fisher-Yates shuffle the indexes deterministically
        for (let i = availableIndexes.length - 1; i > 0; i--) {
            const j = Math.floor(prng() * (i + 1));
            [availableIndexes[i], availableIndexes[j]] = [availableIndexes[j], availableIndexes[i]];
        }

        const prefilledIndexes = availableIndexes.slice(0, 10);
        for (const idx of prefilledIndexes) {
            givenStartingTiles[idx] = targetBoard[idx];
        }

        // 4. Determine the Player's "Bank" (The tiles they must place)
        const bankIndexes = availableIndexes.slice(10);
        const playerBank: Tile[] = bankIndexes.map(idx => targetBoard[idx]).sort(); // Sorted to not give away column placement

        return {
            seed: dateString,
            targetBoard,
            rules,
            givenStartingTiles,
            playerBank
        };
    }

    private static generateRandomRuleForLine(board: Tile[], isRow: boolean, index: number, idCounter: number, prng: seedrandom.PRNG): ConstraintRule {
        // Extract the target line
        const line = isRow ? 
            board.slice(index * 5, index * 5 + 5) : 
            [0, 1, 2, 3, 4].map(r => board[r * 5 + index]);

        // Pick a constraint type randomly
        const randFloat = prng();
        let selectedType: ConstraintType;
        
        if (randFloat < 0.33) {
            selectedType = ConstraintType.SumToTarget;
        } else if (randFloat < 0.66) {
            selectedType = ConstraintType.ContainsChar;
        } else {
            selectedType = ConstraintType.ExcludeChar;
        }

        // We skip UniqueElements in this random generation because a random 25-char board often fails it, reducing solvable frequency.

        let targetValue: string | number = 0;

        switch (selectedType) {
            case ConstraintType.SumToTarget:
                targetValue = line.reduce((acc, t) => acc + getTileValue(t), 0);
                break;
            case ConstraintType.ContainsChar:
                targetValue = line[Math.floor(prng() * 5)]; // Pick a char that we know is inside it
                break;
            case ConstraintType.ExcludeChar:
                // Find a char not in the line
                let excludeCandidates = ALL_TILES.filter(t => !line.includes(t));
                if (excludeCandidates.length === 0) {
                    // Fallback to sum
                    selectedType = ConstraintType.SumToTarget;
                    targetValue = line.reduce((acc, t) => acc + getTileValue(t), 0);
                } else {
                    targetValue = excludeCandidates[Math.floor(prng() * excludeCandidates.length)];
                }
                break;
            default:
                break;
        }

        return {
            id: `rule_${idCounter}`,
            type: selectedType,
            targetIndex: index,
            isRow: isRow,
            targetValue: targetValue
        };
    }
}
