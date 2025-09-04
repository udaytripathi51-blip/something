// --- STRING OF OPERATORS ---
let operations = "+-*/%";

// --- FUNCTIONS ---
function evaluate(a, operator, b) {
  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b; // Fixed: was a + b
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    case "%":
      result = a % b;
      break;
    default:
      result = "NaN";
  }

  return result;
}

function clearSecondary(secondary) {
  let lastChar = secondary.value.charAt(secondary.value.length - 1);

  if (!operations.includes(lastChar)) {
    secondary.value = "";
  }
}

function addToHistory(expression, result) {
  secondaryDisplay.value = `${expression} = ${result}`;
}

function formatNumber(num) {
  // Handle very large or very small numbers
  if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }
  // Round to avoid floating point precision issues
  return Math.round(num * 1e10) / 1e10;
}

// --- ELEMENTS ---
// display elements
let mainDisplay = document.querySelector("#main");
let secondaryDisplay = document.querySelector("#read");

// input manipulation elements
let clearline = document.querySelector("#clearline");
let clear = document.querySelector("#clear");
let back = document.querySelector("#back");

// operation elements
let root = document.querySelector("#root");
let reciprocal = document.querySelector("#reciprocal");
let square = document.querySelector("#square");
let sign = document.querySelector("#sign");
let operators = document.querySelectorAll(".operator");
let calc = document.querySelector("#calc");

// input
let numbers = document.querySelectorAll(".number");

// equal to tracker
let equalPressed = false;

// --- OPERATION HANDLING ---
// Simple events
// input
clearline.addEventListener("click", () => {
  mainDisplay.value = "";
});

clear.addEventListener("click", () => {
  mainDisplay.value = "";
  secondaryDisplay.value = "";
  equalPressed = false;
});

back.addEventListener("click", () => {
  if (equalPressed) return; // Don't allow backspace after equals
  mainDisplay.value = mainDisplay.value.slice(0, mainDisplay.value.length - 1);
});

//operations
root.addEventListener("click", () => {
  let value = Number(mainDisplay.value);
  if (value < 0) {
    mainDisplay.value = "Error";
    return;
  }
  mainDisplay.value = formatNumber(Math.sqrt(value)); // Fixed: was Math.pow(value, 2)
  clearSecondary(secondaryDisplay);
  equalPressed = true;
});

reciprocal.addEventListener("click", () => {
  let value = Number(mainDisplay.value);
  if (value === 0) {
    mainDisplay.value = "Error";
    return;
  }
  mainDisplay.value = formatNumber(1 / value);
  clearSecondary(secondaryDisplay);
  equalPressed = true;
});

square.addEventListener("click", () => {
  let value = Number(mainDisplay.value);
  mainDisplay.value = formatNumber(Math.pow(value, 2));
  clearSecondary(secondaryDisplay);
  equalPressed = true;
});

sign.addEventListener("click", () => {
  let value = Number(mainDisplay.value);
  mainDisplay.value = formatNumber(-value); // Fixed: now properly toggles sign
  equalPressed = false;
});

// complex events
// input
numbers.forEach((node) => {
  node.addEventListener("click", () => {
    if (equalPressed) {
      mainDisplay.value = "";
      secondaryDisplay.value = "";
      equalPressed = false;
    }

    let text = node.textContent;
    let outputString = mainDisplay.value;

    // Prevent multiple decimal points
    if (text === "." && outputString.includes(".")) return;
    
    // Prevent leading zeros (except for decimal numbers)
    if (text === "0" && outputString === "0") return;
    if (outputString === "0" && text !== ".") {
      mainDisplay.value = text;
      return;
    }

    mainDisplay.value += text;
  });
});

// operations
calc.addEventListener("click", () => {
  let operator = secondaryDisplay.value.charAt(secondaryDisplay.value.length - 1);
  
  if (!operations.includes(operator)) return;

  let a = Number(secondaryDisplay.value.slice(0, secondaryDisplay.value.length - 1));
  let b = Number(mainDisplay.value);
  let expression = `${a} ${operator} ${b}`;

  let result = evaluate(a, operator, b);
  
  // Handle division by zero
  if (operator === "/" && b === 0) {
    mainDisplay.value = "Error";
    secondaryDisplay.value = "";
    equalPressed = true;
    return;
  }

  result = formatNumber(result);
  
  // Fixed: Keep history in secondary display instead of overwriting
  addToHistory(expression, result);
  mainDisplay.value = result;

  equalPressed = true;
});

operators.forEach((node) => {
  node.addEventListener("click", () => {
    let currentOperator = node.textContent === "x" ? "*" : node.textContent;
    let operator = secondaryDisplay.value.charAt(secondaryDisplay.value.length - 1);
    let result;

    // If there's no current operation or the last character isn't an operator
    if (!operations.includes(operator) || operator === "") {
      result = Number(mainDisplay.value);
    } else {
      // Calculate the pending operation first
      let a = Number(secondaryDisplay.value.slice(0, secondaryDisplay.value.length - 1));
      let b = Number(mainDisplay.value);

      // Handle division by zero
      if (operator === "/" && b === 0) {
        mainDisplay.value = "Error";
        secondaryDisplay.value = "";
        return;
      }

      result = evaluate(a, operator, b);
      result = formatNumber(result);
      mainDisplay.value = result;
    }

    equalPressed = false;
    secondaryDisplay.value = `${result}${currentOperator}`;
    mainDisplay.value = "";
  });
});