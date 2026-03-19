import Foundation

public struct AxiomGenerator {
    
    /// Generates all 120 permutations of the 5 symbols
    public static func allPermutations() -> [[Symbol]] {
        return permute(Symbol.allCases)
    }
    
    private static func permute(_ items: [Symbol]) -> [[Symbol]] {
        if items.count <= 1 { return [items] }
        var result: [[Symbol]] = []
        for i in 0..<items.count {
            var reduced = items
            let element = reduced.remove(at: i)
            let subPermutations = permute(reduced)
            for sub in subPermutations {
                result.append([element] + sub)
            }
        }
        return result
    }
    
    /// Generates all possible TRUE rules for a given board
    public static func generateValidRules(for board: [Symbol]) -> [Rule] {
        var rules: [Rule] = []
        let symbols = Symbol.allCases
        
        for primary in symbols {
            let primaryIndex = board.firstIndex(of: primary)!
            
            // Absolute rules
            rules.append(Rule(primary: primary, type: .isInSlot(primaryIndex)))
            
            for secondary in symbols {
                if primary == secondary { continue }
                let secondaryIndex = board.firstIndex(of: secondary)!
                
                // Relative rules
                if primaryIndex == secondaryIndex - 1 {
                    rules.append(Rule(primary: primary, type: .isImmediatelyLeftOf, secondary: secondary))
                }
                if primaryIndex == secondaryIndex + 1 {
                    rules.append(Rule(primary: primary, type: .isImmediatelyRightOf, secondary: secondary))
                }
                if primaryIndex < secondaryIndex {
                    rules.append(Rule(primary: primary, type: .isSomewhereLeftOf, secondary: secondary))
                }
                if primaryIndex > secondaryIndex {
                    rules.append(Rule(primary: primary, type: .isSomewhereRightOf, secondary: secondary))
                }
                if abs(primaryIndex - secondaryIndex) == 1 {
                    rules.append(Rule(primary: primary, type: .isNextTo, secondary: secondary))
                } else {
                    rules.append(Rule(primary: primary, type: .isNotNextTo, secondary: secondary))
                }
            }
        }
        return rules
    }
    
    public struct GeneratedPuzzle {
        public let targetBoard: [Symbol]
        public let rules: [Rule]
    }
    
    /// Generates a puzzle with exactly one unique solution
    public static func generatePuzzle(targetRuleCount: Int = 4) -> GeneratedPuzzle? {
        let allBoards = allPermutations()
        
        // Pick a random target board
        let targetBoard = allBoards.randomElement()!
        
        // Generate all true rules for this board
        var allTrueRules = generateValidRules(for: targetBoard)
        
        // Try creating random subsets until we find one that uniquely identifies the board
        for _ in 0..<1000 {
            allTrueRules.shuffle()
            
            // Pick N random rules
            let subset = Array(allTrueRules.prefix(targetRuleCount))
            
            // Test against all 120 boards
            var validBoardsCount = 0
            for testBoard in allBoards {
                if AxiomValidator.isValid(board: testBoard, rules: subset) {
                    validBoardsCount += 1
                }
            }
            
            // If ONLY the target board passes, we have a unique logic puzzle!
            if validBoardsCount == 1 {
                return GeneratedPuzzle(targetBoard: targetBoard, rules: subset)
            }
        }
        
        // Retry with a different rule count or more iterations if needed
        return nil
    }
}
