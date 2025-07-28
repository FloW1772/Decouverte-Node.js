const SSN = require('french-ssn');

console.log(SSN.parse('2 55 08 14 168 025 38'));

console.log(SSN.validate('2 55 08 14 168 025 12')); // false
console.log(SSN.validate('2 55 08 14 168 025 38')); // true

const newSSN = SSN.make({ gender: 1, month: 5, year: 78, place: "99330", rank: 108 }); // "1780599330108"
console.log(newSSN);

console.log(SSN.format('178059933010817')); // "1 78 05 99 330 108