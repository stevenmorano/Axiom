
const SYMBOLS = ['circle', 'triangle', 'square', 'star', 'hexagon'];

const RULE_TYPES = {
  isImmediatelyLeftOf: 'isImmediatelyLeftOf',
  isImmediatelyRightOf: 'isImmediatelyRightOf',
  isSomewhereLeftOf: 'isSomewhereLeftOf',
  isSomewhereRightOf: 'isSomewhereRightOf',
  isNextTo: 'isNextTo',
  isNotNextTo: 'isNotNextTo',
  isInSlot: 'isInSlot',
};

// Generates all 120 permutations of 5 symbols
function generatePermutations(items) {
  if (items.length <= 1) return [items];
  const result = [];
  for (let i = 0; i < items.length; i++) {
    const reduced = [...items];
    const element = reduced.splice(i, 1)[0];
    const subPermutations = generatePermutations(reduced);
    for (const sub of subPermutations) {
      result.push([element, ...sub]);
    }
  }
  return result;
}

const ALL_BOARDS = generatePermutations(SYMBOLS);

function evaluateRule(rule, board) {
  const primaryIndex = board.indexOf(rule.primary);
  if (primaryIndex === -1) return false;

  if (rule.type === RULE_TYPES.isInSlot) {
    return primaryIndex === rule.slot;
  }

  const secondaryIndex = board.indexOf(rule.secondary);
  if (secondaryIndex === -1) return false;

  switch (rule.type) {
    case RULE_TYPES.isImmediatelyLeftOf:
      return primaryIndex === secondaryIndex - 1;
    case RULE_TYPES.isImmediatelyRightOf:
      return primaryIndex === secondaryIndex + 1;
    case RULE_TYPES.isSomewhereLeftOf:
      return primaryIndex < secondaryIndex;
    case RULE_TYPES.isSomewhereRightOf:
      return primaryIndex > secondaryIndex;
    case RULE_TYPES.isNextTo:
      return Math.abs(primaryIndex - secondaryIndex) === 1;
    case RULE_TYPES.isNotNextTo:
      return Math.abs(primaryIndex - secondaryIndex) !== 1;
    default:
      return false;
  }
}

function checkWin(currentBoard, rules) {
  if (currentBoard.some(slot => slot === null)) return false;
  return rules.every(rule => evaluateRule(rule, currentBoard));
}

function generateValidRules(board) {
  const rules = [];
  SYMBOLS.forEach(primary => {
    const primaryIndex = board.indexOf(primary);
    
    // Absolute rule
    rules.push({ primary, type: RULE_TYPES.isInSlot, slot: primaryIndex });

    SYMBOLS.forEach(secondary => {
      if (primary === secondary) return;
      const secondaryIndex = board.indexOf(secondary);

      if (primaryIndex === secondaryIndex - 1) {
        rules.push({ primary, secondary, type: RULE_TYPES.isImmediatelyLeftOf });
      }
      if (primaryIndex === secondaryIndex + 1) {
        rules.push({ primary, secondary, type: RULE_TYPES.isImmediatelyRightOf });
      }
      if (primaryIndex < secondaryIndex) {
        rules.push({ primary, secondary, type: RULE_TYPES.isSomewhereLeftOf });
      }
      if (primaryIndex > secondaryIndex) {
        rules.push({ primary, secondary, type: RULE_TYPES.isSomewhereRightOf });
      }
      if (Math.abs(primaryIndex - secondaryIndex) === 1) {
        rules.push({ primary, secondary, type: RULE_TYPES.isNextTo });
      } else {
        rules.push({ primary, secondary, type: RULE_TYPES.isNotNextTo });
      }
    });
  });
  return rules;
}

function generateAxiomPuzzle(ruleCount) {
  const allBoards = generatePermutations(SYMBOLS);
  
  for (let attempt = 0; attempt < 5; attempt++) {
    const targetBoard = allBoards[Math.floor(Math.random() * allBoards.length)];
    let allTrueRules = generateValidRules(targetBoard);

    // Try creating random subsets
    for (let i = 0; i < 500; i++) {
      // Shuffle rules
      for (let j = allTrueRules.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [allTrueRules[j], allTrueRules[k]] = [allTrueRules[k], allTrueRules[j]];
      }

      const currentRuleCount = ruleCount + Math.floor(attempt / 2); // Slightly increase rules if failing
      const subset = allTrueRules.slice(0, currentRuleCount);
      let validBoardsCount = 0;
      for (const testBoard of allBoards) {
        if (subset.every(rule => evaluateRule(rule, testBoard))) {
          validBoardsCount++;
        }
        if (validBoardsCount > 1) break; 
      }

      if (validBoardsCount === 1) {
        return { 
          solution: targetBoard, 
          rules: subset 
        };
      }
    }
  }
  
  // Last ditch effort: Just return one with 4 rules if 3 failed
  if (ruleCount < 4) return generateAxiomPuzzle(ruleCount + 1);
  
  return null;
}

function getRuleDescription(rule) {
    const p = rule.primary.charAt(0).toUpperCase() + rule.primary.slice(1);
    const s = rule.secondary ? rule.secondary.charAt(0).toUpperCase() + rule.secondary.slice(1) : '';
    
    switch (rule.type) {
        case RULE_TYPES.isImmediatelyLeftOf: return `${p} is immediately left of ${s}`;
        case RULE_TYPES.isImmediatelyRightOf: return `${p} is immediately right of ${s}`;
        case RULE_TYPES.isSomewhereLeftOf: return `${p} is somewhere left of ${s}`;
        case RULE_TYPES.isSomewhereRightOf: return `${p} is somewhere right of ${s}`;
        case RULE_TYPES.isNextTo: return `${p} is next to ${s}`;
        case RULE_TYPES.isNotNextTo: return `${p} is NOT next to ${s}`;
        case RULE_TYPES.isInSlot: return `${p} is exactly in slot ${rule.slot + 1}`;
        default: return "Unknown rule";
    }
}

export { SYMBOLS, generateAxiomPuzzle, checkWin, getRuleDescription };
