import { simulateReadOpenings } from '@/features/read/simulate';

const fifty = simulateReadOpenings(50);
console.log('fifty', JSON.stringify(fifty));
if (fifty.uniqueFirstItems < 30 || fifty.uniqueFirstTexts < 28) {
  throw new Error('50 openings were too similar at the start');
}

const report = simulateReadOpenings(100);
console.log(JSON.stringify(report, null, 2));

if (report.mixedStories > 0) {
  throw new Error('Stories mixed across fragments');
}
if (report.shortSessions > 0) {
  throw new Error('Sessions were too short');
}
if (report.minItems < 8) {
  throw new Error('Sessions should have at least 8 moments');
}
if (report.minFragments < 16) {
  throw new Error('Sessions should have enough fragments to keep reading');
}
if (report.uniqueFirstItems < 20) {
  throw new Error('First items repeated too often');
}
if (report.uniqueFirstTexts < 20) {
  throw new Error('First lines repeated too often');
}
if (report.uniqueItemIds < 80) {
  throw new Error('Not enough item variety across 100 openings');
}
if (report.uniquePatterns < 6) {
  throw new Error('Pattern variety too low');
}
if (report.threadMisses > report.openings * 3) {
  throw new Error('Session threads were too loose');
}

console.log('offline simulation passed');
