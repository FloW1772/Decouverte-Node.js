exports.add = function add(a, b) {
    return a + b;
}

exports.sub = function subtract(a, b) {
    return a - b;
}

exports.mult = function multiply(a, b) {
    return a * b;
}  

exports.div = function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

//Synthaxe d'exports de méthodes variables objets etc

module.exports = {
    add,
    sub,
    mult,
    div
};

