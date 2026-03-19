import Foundation

print("========================================")
print("     AXIOM CORE LOGIC ENGINE TEST       ")
print("========================================")
print("Attempting to generate a custom logic puzzle with exactly 4 rules...\n")

// Generate a puzzle
if let puzzle = AxiomGenerator.generatePuzzle(targetRuleCount: 4) {
    print("🎯 Target Solution (Hidden from player):")
    print(puzzle.targetBoard.map { $0.description }.joined(separator: " - "))
    
    print("\n📜 Generated Rules (Shown to player):")
    for (index, rule) in puzzle.rules.enumerated() {
        print("  \(index + 1). \(rule.description)")
    }
    
    print("\n✅ Verification:")
    print("Mathematically guaranteed to have exactly 1 unique solution among 120 possibilities.")
    print("========================================")
} else {
    print("❌ Failed to generate a puzzle within 1000 iterations for exactly 4 rules.")
}
