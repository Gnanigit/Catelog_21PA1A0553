// Required modules
const fs = require("fs");
const path = require("path");

// Function to parse and decode the input JSON file
function parseAndDecode(filePath) {
  // Read the JSON file
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const { n, k } = data.keys; // Number of roots and minimum required roots
  const decodedRoots = [];

  // Decode all provided roots
  for (const key in data) {
    if (!isNaN(key)) {
      const x = parseInt(key, 10);
      const base = parseInt(data[key].base, 10);
      const value = data[key].value;

      // Decode the y-value from its base
      const y = parseInt(value, base);
      decodedRoots.push({ x, y });
    }
  }

  return { decodedRoots, k };
}

// Function to compute the constant term using Lagrange interpolation
function findConstantTerm(decodedRoots, k) {
  const requiredRoots = decodedRoots.slice(0, k); // Use the first k roots

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

  return Math.round(constantTerm); // Round to avoid floating-point issues
}

// Main function
function main() {
  // Paths to the test case files
  const testCase1Path = path.join(__dirname, "testcase1.json");
  const testCase2Path = path.join(__dirname, "testcase2.json");

  // Parse and decode both test cases
  const testCase1 = parseAndDecode(testCase1Path);
  const testCase2 = parseAndDecode(testCase2Path);

  // Find the constant term for both test cases
  const constant1 = findConstantTerm(testCase1.decodedRoots, testCase1.k);
  const constant2 = findConstantTerm(testCase2.decodedRoots, testCase2.k);

  // Output the results
  console.log(`Constant term for Test Case 1: ${constant1}`);
  console.log(`Constant term for Test Case 2: ${constant2}`);
}

// Execute the main function
main();
