const fs = require("fs");
const path = require("path");

function parseAndDecode(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const { n, k } = data.keys;
  const decodedRoots = [];

  for (const key in data) {
    if (!isNaN(key)) {
      const x = parseInt(key, 10);
      const base = parseInt(data[key].base, 10);
      const value = data[key].value;

      const y = parseInt(value, base);
      decodedRoots.push({ x, y });
    }
  }

  return { decodedRoots, k };
}

function findConstantTerm(decodedRoots, k) {
  const requiredRoots = decodedRoots.slice(0, k);
  let constantTerm = 0;

  for (let i = 0; i < requiredRoots.length; i++) {
    let { x: x_i, y: y_i } = requiredRoots[i];
    let term = y_i;

    for (let j = 0; j < requiredRoots.length; j++) {
      if (i !== j) {
        const { x: x_j } = requiredRoots[j];
        term *= x_j / (x_j - x_i);
      }
    }

    constantTerm += term;
  }

  return Math.round(constantTerm);
}

function main() {
  const testCase1Path = path.join(__dirname, "testcase1.json");
  const testCase2Path = path.join(__dirname, "testcase2.json");

  const testCase1 = parseAndDecode(testCase1Path);
  const testCase2 = parseAndDecode(testCase2Path);

  const constant1 = findConstantTerm(testCase1.decodedRoots, testCase1.k);
  const constant2 = findConstantTerm(testCase2.decodedRoots, testCase2.k);

  console.log(`Test Case 1: ${constant1}`);
  console.log(`Test Case 2: ${constant2}`);
}

main();
