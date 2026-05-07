import { AxiomGenerator } from './AxiomGenerator';
import { AxiomValidator } from './AxiomValidator';

console.log("========================================");
console.log("  AXIOM WEB LOGIC ENGINE - DAILY SEED  ");
console.log("========================================");

const todaySeed = new Date().toISOString().split('T')[0];
console.log(`\nGenerating Daily Challenge for Seed: ${todaySeed}\n`);

const dailyPuzzle = AxiomGenerator.generateDailyPuzzle(todaySeed);

console.log("🎯 Target Board Generated successfully.");
console.log("📜 Constraints (Rules):");
for (const rule of dailyPuzzle.rules) {
    let suffix = "";
    if (rule.type === 'SumToTarget' || rule.type === 'ContainsChar' || rule.type === 'ExcludeChar') {
        suffix = ` => ${rule.targetValue}`;
    }
    console.log(`   [${rule.isRow ? 'ROW' : 'COL'} _${rule.targetIndex}_]: ${rule.type}${suffix}`);
}
console.log(`\n🧩 Given Initial Tiles: ${Object.keys(dailyPuzzle.givenStartingTiles).length} / 25 tiles locked in.`);
console.log(`📥 Player Bank size: ${dailyPuzzle.playerBank.length} tiles waiting to be placed.`);

const isValid = AxiomValidator.isGridValid(dailyPuzzle.targetBoard, dailyPuzzle.rules);
console.log(`\n✅ internal Validation Check against Target Board: ${isValid ? 'PASSED' : 'FAILED'}`);
console.log("========================================");
