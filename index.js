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
      result = a + b;
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
});
back.addEventListener("click", () => {
  mainDisplay.value = mainDisplay.value.slice(0, mainDisplay.value.length - 1);
});

//operations
root.addEventListener("click", () => {
  mainDisplay.value = Math.pow(Number(mainDisplay.value), 2);
  clearSecondary(secondaryDisplay);
});
reciprocal.addEventListener("click", () => {
  mainDisplay.value = 1 / Number(mainDisplay.value);
  clearSecondary(secondaryDisplay);
});
square.addEventListener("click", () => {
  mainDisplay.value = Math.pow(Number(mainDisplay.value), 2);
  clearSecondary(secondaryDisplay);
});
sign.addEventListener("click", () => {
  mainDisplay.value = Number(mainDisplay.value);
});

// complex events
// input
numbers.forEach((node) => {
  node.addEventListener("click", () => {
    if (equalPressed) {
      clear.click();
    }

    text = node.textContent;
    outputString = mainDisplay.value;

    if (text == "." && outputString.includes(".")) return;

    mainDisplay.value += text;

    equalPressed = false;
  });
});

// operations
calc.addEventListener("click", () => {
  if (
    !operations.includes(
      secondaryDisplay.value.charAt(secondaryDisplay.value.length - 1)
    )
  )
    return;

  let a = 0,
    operator = "+",
    b = Number(mainDisplay.value);

  if (secondaryDisplay.value !== "") {
    a = Number(
      secondaryDisplay.value.slice(0, secondaryDisplay.value.length - 1)
    );
    operator = secondaryDisplay.value.charAt(secondaryDisplay.value.length - 1);
  }

  let result = evaluate(a, operator, b);

  secondaryDisplay.value = mainDisplay.value;
  mainDisplay.value = result;

  equalPressed = true;
});

operators.forEach((node) => {
  node.addEventListener("click", () => {
    let currentOperator = node.textContent === "x" ? "*" : node.textContent;
    let operator = secondaryDisplay.value.charAt(
      secondaryDisplay.value.length - 1
    );
    let result;

    if (!operations.includes(operator) || operator === "") {
      result = Number(mainDisplay.value);
    } else {
      let a = Number(
        secondaryDisplay.value.slice(0, secondaryDisplay.value.length - 1)
      );
      let b = Number(mainDisplay.value);

      result = evaluate(a, operator, b);
    }

    equalPressed = false;

    secondaryDisplay.value = `${result}${currentOperator}`;
    mainDisplay.value = "";
  });
});
