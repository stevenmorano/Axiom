import Foundation

// A simple view model that UI agents can use to drive the SwiftUI views.
public class GameViewModel {
    
    public var currentRules: [Rule] = []
    public var targetBoard: [Symbol] = [] // The solution (hidden from player)
    public var currentBoard: [Symbol?] = [nil, nil, nil, nil, nil]
    public var isSolved: Bool = false
    public var timeElapsed: TimeInterval = 0
    
    public init() {}
    
    public func startNewDayPuzzle() {
        // In a real app, this would fetch the predefined daily puzzle from a server.
        // For testing, we generate one on the fly.
        if let puzzle = AxiomGenerator.generatePuzzle(targetRuleCount: 4) {
            self.currentRules = puzzle.rules
            self.targetBoard = puzzle.targetBoard
            self.currentBoard = [nil, nil, nil, nil, nil]
            self.isSolved = false
            self.timeElapsed = 0
        }
    }
    
    public func place(symbol: Symbol, at slot: Int) {
        guard !isSolved else { return }
        guard slot >= 0 && slot < 5 else { return }
        
        // Remove symbol if it exists elsewhere
        if let existingIndex = currentBoard.firstIndex(of: symbol) {
            currentBoard[existingIndex] = nil
        }
        
        currentBoard[slot] = symbol
        checkWinCondition()
    }
    
    private func checkWinCondition() {
        // Ensure board is full
        let fullBoard = currentBoard.compactMap { $0 }
        if fullBoard.count == 5 {
            if AxiomValidator.isValid(board: fullBoard, rules: currentRules) {
                isSolved = true
            }
        }
    }
}
