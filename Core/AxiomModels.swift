import Foundation

// The 5 distinct visual symbols used in the game.
public enum Symbol: Int, CaseIterable, Equatable, CustomStringConvertible {
    case circle
    case triangle
    case square
    case star
    case hexagon
    
    public var description: String {
        switch self {
        case .circle: return "Circle"
        case .triangle: return "Triangle"
        case .square: return "Square"
        case .star: return "Star"
        case .hexagon: return "Hexagon"
        }
    }
}

// The constraint types that dictate where symbols can be placed.
public enum RuleType: Equatable {
    case isImmediatelyLeftOf    // A is exactly layout index - 1 of B
    case isImmediatelyRightOf   // A is exactly layout index + 1 of B
    case isSomewhereLeftOf      // A is at any layout index < B
    case isSomewhereRightOf     // A is at any layout index > B
    case isNextTo               // A is immediately left or right of B
    case isNotNextTo            // A is neither immediately left nor right of B
    case isInSlot(Int)          // A is exactly at index (0...4)
}

// A single rule that applies absolute or relative logic.
public struct Rule: Equatable {
    public let primaryObj: Symbol
    public let secondaryObj: Symbol?
    public let ruleType: RuleType
    
    public init(primary: Symbol, type: RuleType, secondary: Symbol? = nil) {
         self.primaryObj = primary
         self.ruleType = type
         self.secondaryObj = secondary
    }
    
    public var description: String {
        switch ruleType {
        case .isImmediatelyLeftOf: return "\(primaryObj) is immediately left of \(secondaryObj!)"
        case .isImmediatelyRightOf: return "\(primaryObj) is immediately right of \(secondaryObj!)"
        case .isSomewhereLeftOf: return "\(primaryObj) is somewhere left of \(secondaryObj!)"
        case .isSomewhereRightOf: return "\(primaryObj) is somewhere right of \(secondaryObj!)"
        case .isNextTo: return "\(primaryObj) is next to \(secondaryObj!)"
        case .isNotNextTo: return "\(primaryObj) is NOT next to \(secondaryObj!)"
        case .isInSlot(let slot): return "\(primaryObj) is exactly in slot \(slot + 1)"
        }
    }
}

// The game state represented as an array of 5 optional symbols.
public typealias BoardState = [Symbol?]
