const start = 1733011200000; // Dec 1, 2024
const now = Date.now();
const diff = now - start;
const interval = 15 * 60 * 1000;
const count = 500 + Math.floor(diff / interval);

console.log('Start:', start);
console.log('Now:', now);
console.log('Diff:', diff);
console.log('Interval:', interval);
console.log('Count:', count);
console.log('Date Start:', new Date(start).toISOString());
console.log('Date Now:', new Date(now).toISOString());
