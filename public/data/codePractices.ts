import type { CodePractice } from "../../src/@types/types";

/**
 * Code Practice exercises — these are interleaved into each course
 * after every two lessons so students can apply what they just learned
 * before moving on.
 *
 * Each practice is keyed by topic + position so a course with 3 topics
 * (each containing 3 lessons) yields 3 practices — one after the first
 * two lessons of every topic. The `id` is generated dynamically per
 * course / topic in `getPracticesForCourse`.
 */
const PRACTICES_BY_INDEX: CodePractice[] = [

  {
    id: "p0",
    title: "Practice #1 — Variables & Output",
    description:
      "Practice declaring variables and printing values. Combine what you've learned about types, strings and arithmetic.",
    instructions: [
      "Create a constant called `studentName` with your own name.",
      "Create a constant called `hoursStudied` with the number 2.",
      "Print exactly: `Hello, <studentName>! You have studied for <hoursStudied> hours.`",
    ],
    starterCode:
`// ✏️ Write your solution below
const studentName = "";
const hoursStudied = 0;

console.log(\`Hello, \${studentName}! You have studied for \${hoursStudied} hours.\`);
`,
    expectedOutput: "Hello, Alex! You have studied for 2 hours.",
    language: "javascript",
    difficulty: "easy",
  },
  {
    id: "p1",
    title: "Practice #2 — Functions & Conditions",
    description:
      "Wrap logic in a function and return a value based on a condition.",
    instructions: [
      "Write a function called `gradeFor(score)`.",
      "If `score >= 90` return `'A'`.",
      "If `score >= 75` return `'B'`.",
      "Otherwise return `'C'`.",
      "Call the function with `82` and `console.log` the result.",
    ],
    starterCode:
`function gradeFor(score) {
  // your code here
}

console.log(gradeFor(82));
`,
    expectedOutput: "B",
    language: "javascript",
    difficulty: "easy",
  },
  {
    id: "p2",
    title: "Practice #3 — Loops & Arrays",
    description:
      "Iterate over an array and compute a summary value.",
    instructions: [
      "You are given the array `const numbers = [4, 8, 15, 16, 23, 42]`.",
      "Compute the sum of all numbers using a loop.",
      "Print exactly: `Total: <sum>`.",
    ],
    starterCode:
`const numbers = [4, 8, 15, 16, 23, 42];
let sum = 0;

// loop over numbers and accumulate the sum

console.log(\`Total: \${sum}\`);
`,
    expectedOutput: "Total: 108",
    language: "javascript",
    difficulty: "medium",
  },
  {
    id: "p3",
    title: "Practice #4 — Objects & Transformations",
    description:
      "Transform data using object methods.",
    instructions: [
      "You are given the array of users below.",
      "Build a new array `names` containing only the `name` property of each user.",
      "Print the `names` array as a comma-separated string.",
    ],
    starterCode:
`const users = [
  { name: "Anna", age: 24 },
  { name: "Ben", age: 30 },
  { name: "Cara", age: 28 },
];

const names = users.map(u => /* your code */ "");

// expected: Anna, Ben, Cara
console.log(names.join(", "));
`,
    expectedOutput: "Anna, Ben, Cara",
    language: "javascript",
    difficulty: "medium",
  },
  {
    id: "p4",
    title: "Practice #5 — String Manipulation",
    description:
      "Manipulate strings to produce a transformed output.",
    instructions: [
      "Given the string `const phrase = \"  learn javascript fast  \"`.",
      "Trim the whitespace and convert it to Title Case.",
      "Print exactly: `Learn Javascript Fast`.",
    ],
    starterCode:
`const phrase = "  learn javascript fast  ";

// your code here
console.log(/* result */ "");
`,
    expectedOutput: "Learn Javascript Fast",
    language: "javascript",
    difficulty: "medium",
  },
  {
    id: "p5",
    title: "Practice #6 — Recursion",
    description:
      "Solve a problem recursively.",
    instructions: [
      "Implement a function `factorial(n)` that returns the factorial of `n`.",
      "Call it with `5` and print the result.",
    ],
    starterCode:
`function factorial(n) {
  // base case + recursive case
}

console.log(factorial(5));
`,
    expectedOutput: "120",
    language: "javascript",
    difficulty: "hard",
  },
  {
    id: "p6",
    title: "Practice #7 — Error Handling",
    description:
      "Safely parse user input using try/catch.",
    instructions: [
      "Wrap `JSON.parse(input)` in a try/catch block.",
      "If parsing succeeds, print `OK`.",
      "If parsing fails, print `Invalid JSON`.",
    ],
    starterCode:
`const input = '{"ok": true}';

try {
  const data = JSON.parse(input);
  // print OK if parsed successfully
} catch (err) {
  // print Invalid JSON on failure
}
`,
    expectedOutput: "OK",
    language: "javascript",
    difficulty: "medium",
  },
  {
    id: "p7",
    title: "Practice #8 — Final Challenge",
    description:
      "Combine everything into one mini program.",
    instructions: [
      "Given `const cart = [{name:'Book', price: 10}, {name:'Pen', price: 3}]`.",
      "Calculate the total price of the cart.",
      "Apply a 10% discount if total >= 20.",
      "Print the final amount formatted to 2 decimals: `Final: <amount>`.",
    ],
    starterCode:
`const cart = [
  { name: "Book", price: 10 },
  { name: "Pen", price: 3 },
];

let total = 0;
// your code

console.log(\`Final: \${total.toFixed(2)}\`);
`,
    expectedOutput: "Final: 13.00",
    language: "javascript",
    difficulty: "hard",
  },
];

/**
 * Pick code practices for a given course, based on the number of
 * "lesson pairs" it contains. We treat every two lessons as one
 * practice slot.
 *
 * Returns one CodePractice per pair of lessons, looping through the
 * catalog above so any course length is covered.
 */
export function getPracticesForCourse(lessonCount: number): CodePractice[] {
  const pairs = Math.max(1, Math.floor(lessonCount / 2));
  const practices: CodePractice[] = [];

  for (let i = 0; i < pairs; i++) {
    const template = PRACTICES_BY_INDEX[i % PRACTICES_BY_INDEX.length];
    practices.push({
      ...template,
      id: `practice-${i + 1}`,
      title: template.title.replace(/^Practice #\d+/, `Practice #${i + 1}`),
    });
  }

  return practices;
}