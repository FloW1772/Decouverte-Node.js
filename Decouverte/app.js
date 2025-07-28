console.log("Hello, World!");


//importation du module calculatrice
//const calc = require("./calculatrice.js");
import {add, mult} from "./calculatrice.js";

let result = calc.add(10, 2);
console.log("10 + 2 =", result);

result = mult(10, 2);
console.log("10 * 2 =", result);