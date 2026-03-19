import Foundation

public struct AxiomValidator {
    
    /// Checks if a fully populated board (5 symbols) satisfies all given rules.
    public static func isValid(board: [Symbol], rules: [Rule]) -> Bool {
        guard board.count == 5 else { return false }
        
        for rule in rules {
            if !evaluate(rule: rule, on: board) {
                return false
            }
        }
        return true
    }
    
    /// Evaluates a single rule against a fully populated board.
    public static func evaluate(rule: Rule, on board: [Symbol]) -> Bool {
        guard let primaryIndex = board.firstIndex(of: rule.primaryObj) else { return false }
        
        // Handle absolute placement rule first
        if case let .isInSlot(slotIndex) = rule.ruleType {
            return primaryIndex == slotIndex
        }
        
        // Handle relative rules requiring a secondary object
        guard let secondaryObj = rule.secondaryObj,
              let secondaryIndex = board.firstIndex(of: secondaryObj) else {
            return false
        }
        
        switch rule.ruleType {
        case .isImmediatelyLeftOf:
            return primaryIndex == secondaryIndex - 1
        case .isImmediatelyRightOf:
            return primaryIndex == secondaryIndex + 1
        case .isSomewhereLeftOf:
            return primaryIndex < secondaryIndex
        case .isSomewhereRightOf:
            return primaryIndex > secondaryIndex
        case .isNextTo:
            return abs(primaryIndex - secondaryIndex) == 1
        case .isNotNextTo:
            return abs(primaryIndex - secondaryIndex) != 1
        case .isInSlot(_):
            fatalError("Should be handled above")
        }
    }
}
