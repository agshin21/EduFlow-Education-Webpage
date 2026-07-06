import type { CodePractice } from "../../src/@types/types";

const PRACTICES_BY_COURSE: Record<string, CodePractice[]> = {

  "1": [
    {
      id: "c1-p1",
      title: "Practice #1 — JSX Elements & Expressions",
      description:
        "Practise embedding JavaScript expressions inside JSX by returning a greeting string.",
      instructions: [
        "Create a variable `name` with the value `'React'`.",
        "Create a variable `year` with the value `2013` (the year React was released).",
        "Print exactly: `Hello from <name>, released in <year>!`",
      ],
      starterCode:
`// JSX embeds JS expressions with {} — here we just build the string.
const name = "";
const year = 0;

console.log(\`Hello from \${name}, released in \${year}!\`);
`,
      expectedOutput: "Hello from React, released in 2013!",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c1-p2",
      title: "Practice #2 — Rendering a List (map)",
      description:
        "In JSX you render lists with .map(). Practise the same pattern in plain JS.",
      instructions: [
        "Given `const skills = ['JSX', 'Props', 'State']`.",
        "Use `.map()` to prefix each skill with `'✔ '`.",
        "Print them joined by a comma and a space.",
      ],
      starterCode:
`const skills = ["JSX", "Props", "State"];

const rendered = skills.map(s => /* your code */ s);

console.log(rendered.join(", "));
`,
      expectedOutput: "✔ JSX, ✔ Props, ✔ State",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c1-p3",
      title: "Practice #3 — Conditional Rendering",
      description:
        "Components often render differently based on a condition. Recreate that logic.",
      instructions: [
        "Write a function `statusLabel(isLoggedIn)`.",
        "Return `'Welcome back!'` if `isLoggedIn` is true, otherwise `'Please sign in'`.",
        "Call it with `true` and print the result.",
      ],
      starterCode:
`function statusLabel(isLoggedIn) {
  // use a ternary or if/else
}

console.log(statusLabel(true));
`,
      expectedOutput: "Welcome back!",
      language: "javascript",
      difficulty: "easy",
    },
  ],


  "2": [
    {
      id: "c2-p1",
      title: "Practice #1 — Typed Variables",
      description:
        "Model the idea of typed values. Build a typed-looking user summary.",
      instructions: [
        "Create `const user = { name: 'Sara', age: 25 }`.",
        "Print exactly: `Sara is 25 years old.`",
      ],
      starterCode:
`const user = { name: "", age: 0 };

console.log(\`\${user.name} is \${user.age} years old.\`);
`,
      expectedOutput: "Sara is 25 years old.",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c2-p2",
      title: "Practice #2 — Typed Props (object shape)",
      description:
        "Component props are just objects with a fixed shape. Build a function that reads one.",
      instructions: [
        "Write a function `buttonLabel(props)` that takes `{ text, count }`.",
        "Return `'<text> (<count>)'`.",
        "Call it with `{ text: 'Likes', count: 3 }` and print the result.",
      ],
      starterCode:
`function buttonLabel(props) {
  // read props.text and props.count
}

console.log(buttonLabel({ text: "Likes", count: 3 }));
`,
      expectedOutput: "Likes (3)",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c2-p3",
      title: "Practice #3 — Optional & Default Values",
      description:
        "Optional props often need default values. Practise the default-value pattern.",
      instructions: [
        "Write a function `greet(name)` where `name` defaults to `'Guest'`.",
        "Return `'Hi, <name>!'`.",
        "Call it once with no argument and print the result.",
      ],
      starterCode:
`function greet(name = "") {
  return \`Hi, \${name}!\`;
}

console.log(greet());
`,
      expectedOutput: "Hi, Guest!",
      language: "javascript",
      difficulty: "medium",
    },
  ],

 
  "3": [
    {
      id: "c3-p1",
      title: "Practice #1 — Closures (counter)",
      description:
        "Closures let an inner function remember an outer variable. Build a counter.",
      instructions: [
        "Write `makeCounter()` that returns a function.",
        "Each call to the returned function increments and returns a private count.",
        "Create one counter, call it three times, print the last result.",
      ],
      starterCode:
`function makeCounter() {
  // keep a private 'count' here and return a function
}

const counter = makeCounter();
counter();
counter();
console.log(counter());
`,
      expectedOutput: "3",
      language: "javascript",
      difficulty: "hard",
    },
    {
      id: "c3-p2",
      title: "Practice #2 — 'this' & Objects",
      description:
        "Understand how `this` refers to the object a method is called on.",
      instructions: [
        "Create an object `account` with `balance: 100` and a method `describe()`.",
        "`describe()` must return `'Balance: <balance>'` using `this.balance`.",
        "Call `account.describe()` and print it.",
      ],
      starterCode:
`const account = {
  balance: 100,
  describe() {
    // use this.balance
  },
};

console.log(account.describe());
`,
      expectedOutput: "Balance: 100",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c3-p3",
      title: "Practice #3 — Async / Await",
      description:
        "Practise awaiting a promise and using its resolved value.",
      instructions: [
        "`getData()` returns a promise that resolves to `'loaded'`.",
        "Write an async function `main()` that awaits it and prints the value.",
        "Call `main()`.",
      ],
      starterCode:
`function getData() {
  return Promise.resolve("loaded");
}

async function main() {
  // await getData() and print the result
}

main();
`,
      expectedOutput: "loaded",
      language: "javascript",
      difficulty: "hard",
    },
  ],

  
  "4": [
    {
      id: "c4-p1",
      title: "Practice #1 — Flexbox Item Count",
      description:
        "Reason about a flex layout in code: how many items fit per row.",
      instructions: [
        "A container is `600` px wide, each flex item is `150` px wide.",
        "Compute how many items fit in one row (whole items only).",
        "Print exactly: `Items per row: <n>`.",
      ],
      starterCode:
`const containerWidth = 600;
const itemWidth = 150;

const perRow = 0; // compute this

console.log(\`Items per row: \${perRow}\`);
`,
      expectedOutput: "Items per row: 4",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c4-p2",
      title: "Practice #2 — Grid Template Columns",
      description:
        "Generate a CSS grid-template-columns value programmatically.",
      instructions: [
        "Write `gridColumns(n)` that returns the CSS value for `n` equal columns.",
        "For `n = 3` it must return `'1fr 1fr 1fr'`.",
        "Call it with `3` and print the result.",
      ],
      starterCode:
`function gridColumns(n) {
  // build "1fr 1fr ..." with n parts
}

console.log(gridColumns(3));
`,
      expectedOutput: "1fr 1fr 1fr",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c4-p3",
      title: "Practice #3 — Responsive Breakpoint",
      description:
        "Return a layout name based on the viewport width (mobile-first thinking).",
      instructions: [
        "Write `layoutFor(width)`.",
        "Return `'mobile'` if width < 768, `'tablet'` if width < 1024, else `'desktop'`.",
        "Call it with `900` and print the result.",
      ],
      starterCode:
`function layoutFor(width) {
  // your conditions here
}

console.log(layoutFor(900));
`,
      expectedOutput: "tablet",
      language: "javascript",
      difficulty: "medium",
    },
  ],


  "5": [
    {
      id: "c5-p1",
      title: "Practice #1 — Simple Router",
      description:
        "Simulate route handling: map a path to a response string.",
      instructions: [
        "Write `handleRoute(path)`.",
        "Return `'Home'` for `'/'`, `'About'` for `'/about'`, else `'404'`.",
        "Call it with `'/about'` and print the result.",
      ],
      starterCode:
`function handleRoute(path) {
  // match the path
}

console.log(handleRoute("/about"));
`,
      expectedOutput: "About",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c5-p2",
      title: "Practice #2 — Validating a Request Body",
      description:
        "Middleware often validates the incoming body. Recreate that check.",
      instructions: [
        "Write `validate(body)` where body is `{ email }`.",
        "Return `'valid'` if email includes `'@'`, otherwise `'invalid'`.",
        "Call it with `{ email: 'a@b.com' }` and print the result.",
      ],
      starterCode:
`function validate(body) {
  // check body.email
}

console.log(validate({ email: "a@b.com" }));
`,
      expectedOutput: "valid",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c5-p3",
      title: "Practice #3 — Building a JSON Response",
      description:
        "Endpoints return JSON. Build and stringify a response object.",
      instructions: [
        "Create a response object `{ status: 200, message: 'OK' }`.",
        "Print it as a JSON string using `JSON.stringify`.",
      ],
      starterCode:
`const res = { status: 200, message: "OK" };

console.log(/* stringify res */ "");
`,
      expectedOutput: `{"status":200,"message":"OK"}`,
      language: "javascript",
      difficulty: "medium",
    },
  ],


  "6": [
    {
      id: "c6-p1",
      title: "Practice #1 — HTTP Status Codes",
      description:
        "Map a scenario to the correct HTTP status code.",
      instructions: [
        "Write `statusFor(scenario)`.",
        "Return `201` for `'created'`, `404` for `'missing'`, else `200`.",
        "Call it with `'created'` and print the result.",
      ],
      starterCode:
`function statusFor(scenario) {
  // return the right code
}

console.log(statusFor("created"));
`,
      expectedOutput: "201",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c6-p2",
      title: "Practice #2 — Pagination Slice",
      description:
        "Return the correct slice of records for a page.",
      instructions: [
        "Given `const items = [1,2,3,4,5,6,7,8,9,10]`, `page = 2`, `size = 3`.",
        "Return the items on page 2 (1-based) as an array.",
        "Print them joined by a comma.",
      ],
      starterCode:
`const items = [1,2,3,4,5,6,7,8,9,10];
const page = 2;
const size = 3;

const start = 0; // compute
const pageItems = []; // slice items

console.log(pageItems.join(","));
`,
      expectedOutput: "4,5,6",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c6-p3",
      title: "Practice #3 — Sorting by Query Param",
      description:
        "Sort a collection based on a sort direction, like an API query param.",
      instructions: [
        "Given `const nums = [3, 1, 2]` and `order = 'desc'`.",
        "Sort ascending if `'asc'`, descending if `'desc'`.",
        "Print the sorted array joined by a comma.",
      ],
      starterCode:
`const nums = [3, 1, 2];
const order = "desc";

const sorted = [...nums]; // sort based on order

console.log(sorted.join(","));
`,
      expectedOutput: "3,2,1",
      language: "javascript",
      difficulty: "medium",
    },
  ],


  "7": [
    {
      id: "c7-p1",
      title: "Practice #1 — Building a Path",
      description:
        "Construct a route path from a base and a param.",
      instructions: [
        "Write `userPath(id)` that returns `'/users/<id>'`.",
        "Call it with `42` and print the result.",
      ],
      starterCode:
`function userPath(id) {
  // return the path
}

console.log(userPath(42));
`,
      expectedOutput: "/users/42",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c7-p2",
      title: "Practice #2 — Reading a Route Param",
      description:
        "Extract a dynamic segment from a URL path (like useParams).",
      instructions: [
        "Given `const path = '/courses/react'`.",
        "Extract the last segment (`'react'`).",
        "Print exactly: `Course: react`.",
      ],
      starterCode:
`const path = "/courses/react";

const slug = ""; // extract last segment

console.log(\`Course: \${slug}\`);
`,
      expectedOutput: "Course: react",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c7-p3",
      title: "Practice #3 — Protected Route Redirect",
      description:
        "Decide where to send a user based on auth state.",
      instructions: [
        "Write `redirectFor(isAuth)`.",
        "Return `'/dashboard'` if authenticated, else `'/login'`.",
        "Call it with `false` and print the result.",
      ],
      starterCode:
`function redirectFor(isAuth) {
  // your logic here
}

console.log(redirectFor(false));
`,
      expectedOutput: "/login",
      language: "javascript",
      difficulty: "easy",
    },
  ],


  "8": [
    {
      id: "c8-p1",
      title: "Practice #1 — A Reducer Function",
      description:
        "Reducers compute the next state from the current state and an action.",
      instructions: [
        "Write `reducer(state, action)` for a counter.",
        "Handle `'increment'` (+1) and `'decrement'` (-1); otherwise return state.",
        "Start from `0`, apply `'increment'`, print the result.",
      ],
      starterCode:
`function reducer(state, action) {
  // switch on action.type
}

console.log(reducer(0, { type: "increment" }));
`,
      expectedOutput: "1",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c8-p2",
      title: "Practice #2 — Immutable State Update",
      description:
        "Redux state must be updated immutably. Practise the spread pattern.",
      instructions: [
        "Given `const state = { count: 5, name: 'app' }`.",
        "Create a new state where `count` becomes `6`, without mutating the original.",
        "Print the new state as JSON.",
      ],
      starterCode:
`const state = { count: 5, name: "app" };

const next = { ...state }; // update count immutably

console.log(JSON.stringify(next));
`,
      expectedOutput: `{"count":6,"name":"app"}`,
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c8-p3",
      title: "Practice #3 — Async Thunk Result",
      description:
        "A thunk resolves data asynchronously. Handle its result.",
      instructions: [
        "`fetchUser()` returns a promise resolving to `{ id: 1, name: 'Lee' }`.",
        "In an async `main()`, await it and print `'User: <name>'`.",
        "Call `main()`.",
      ],
      starterCode:
`function fetchUser() {
  return Promise.resolve({ id: 1, name: "Lee" });
}

async function main() {
  // await fetchUser() and print the name
}

main();
`,
      expectedOutput: "User: Lee",
      language: "javascript",
      difficulty: "hard",
    },
  ],

 
  "9": [
    {
      id: "c9-p1",
      title: "Practice #1 — A Minimal Store",
      description:
        "Zustand stores hold state and setters. Model a tiny store object.",
      instructions: [
        "Create `store = { count: 0, inc() {...} }` where `inc` increments count.",
        "Call `inc()` twice, then print `store.count`.",
      ],
      starterCode:
`const store = {
  count: 0,
  inc() {
    // increment this.count
  },
};

store.inc();
store.inc();
console.log(store.count);
`,
      expectedOutput: "2",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c9-p2",
      title: "Practice #2 — Selecting Slice State",
      description:
        "Selectors read one part of the store. Practise selecting a value.",
      instructions: [
        "Given `const state = { user: { name: 'Mia' }, theme: 'dark' }`.",
        "Write a selector that returns only `state.user.name`.",
        "Print the selected value.",
      ],
      starterCode:
`const state = { user: { name: "Mia" }, theme: "dark" };

const selectName = (s) => /* your code */ "";

console.log(selectName(state));
`,
      expectedOutput: "Mia",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c9-p3",
      title: "Practice #3 — Combining Slices",
      description:
        "Combine two slice objects into one store, like the slices pattern.",
      instructions: [
        "Given `const authSlice = { user: 'Ana' }` and `const uiSlice = { open: true }`.",
        "Merge them into a single `store` object.",
        "Print the store as JSON.",
      ],
      starterCode:
`const authSlice = { user: "Ana" };
const uiSlice = { open: true };

const store = {}; // combine both slices

console.log(JSON.stringify(store));
`,
      expectedOutput: `{"user":"Ana","open":true}`,
      language: "javascript",
      difficulty: "medium",
    },
  ],


  "10": [
    {
      id: "c10-p1",
      title: "Practice #1 — Cache Key",
      description:
        "Query caches are keyed by arrays. Build a stable cache key.",
      instructions: [
        "Write `queryKey(resource, id)` returning `['<resource>', <id>]` as JSON.",
        "Call it with `'user'` and `7`, print the JSON string.",
      ],
      starterCode:
`function queryKey(resource, id) {
  // return [resource, id]
}

console.log(JSON.stringify(queryKey("user", 7)));
`,
      expectedOutput: `["user",7]`,
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c10-p2",
      title: "Practice #2 — Stale Check",
      description:
        "Decide if cached data is stale based on staleTime.",
      instructions: [
        "Write `isStale(ageMs, staleTimeMs)`.",
        "Return `true` if `ageMs > staleTimeMs`, else `false`.",
        "Call it with `5000, 3000` and print the result.",
      ],
      starterCode:
`function isStale(ageMs, staleTimeMs) {
  // compare the two
}

console.log(isStale(5000, 3000));
`,
      expectedOutput: "true",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c10-p3",
      title: "Practice #3 — Optimistic Update",
      description:
        "Optimistic updates change the cache before the server responds.",
      instructions: [
        "Given `const todos = [{ id: 1, done: false }]`.",
        "Return a new list where todo id 1 has `done: true` (immutably).",
        "Print the result as JSON.",
      ],
      starterCode:
`const todos = [{ id: 1, done: false }];

const updated = todos.map(t => /* toggle done for id 1 */ t);

console.log(JSON.stringify(updated));
`,
      expectedOutput: `[{"id":1,"done":true}]`,
      language: "javascript",
      difficulty: "medium",
    },
  ],

  
  "11": [
    {
      id: "c11-p1",
      title: "Practice #1 — 8pt Spacing Scale",
      description:
        "Generate a spacing value on an 8-point scale.",
      instructions: [
        "Write `space(step)` that returns `step * 8` followed by `'px'`.",
        "Call it with `3` and print the result.",
      ],
      starterCode:
`function space(step) {
  // return "<step*8>px"
}

console.log(space(3));
`,
      expectedOutput: "24px",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c11-p2",
      title: "Practice #2 — Type Scale",
      description:
        "Build a modular type scale by multiplying a ratio.",
      instructions: [
        "Base font is `16`, ratio is `1.25`.",
        "Compute the next size up, rounded to a whole number.",
        "Print exactly: `Next size: <n>px`.",
      ],
      starterCode:
`const base = 16;
const ratio = 1.25;

const next = 0; // base * ratio, rounded

console.log(\`Next size: \${next}px\`);
`,
      expectedOutput: "Next size: 20px",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c11-p3",
      title: "Practice #3 — Hex to RGB",
      description:
        "Convert a brand color from hex to an rgb() string.",
      instructions: [
        "Given `const hex = '#ff8800'`.",
        "Convert it to `'rgb(255, 136, 0)'`.",
        "Print the result.",
      ],
      starterCode:
`const hex = "#ff8800";

const r = parseInt(hex.slice(1, 3), 16);
const g = 0; // parse green
const b = 0; // parse blue

console.log(\`rgb(\${r}, \${g}, \${b})\`);
`,
      expectedOutput: "rgb(255, 136, 0)",
      language: "javascript",
      difficulty: "hard",
    },
  ],

  
  "12": [
    {
      id: "c12-p1",
      title: "Practice #1 — Transition Shorthand",
      description:
        "Build a CSS transition shorthand string programmatically.",
      instructions: [
        "Write `transition(prop, ms)` returning `'<prop> <ms>ms ease'`.",
        "Call it with `'opacity'` and `300`, print the result.",
      ],
      starterCode:
`function transition(prop, ms) {
  // return the shorthand
}

console.log(transition("opacity", 300));
`,
      expectedOutput: "opacity 300ms ease",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c12-p2",
      title: "Practice #2 — Keyframe Percentages",
      description:
        "Generate evenly spaced keyframe percentages.",
      instructions: [
        "Write `keyframes(n)` returning n percentages from 0 to 100 (inclusive).",
        "For `n = 3` return `'0%, 50%, 100%'`.",
        "Call it with `3` and print the result.",
      ],
      starterCode:
`function keyframes(n) {
  const parts = [];
  // build n evenly spaced percentages
  return parts.join(", ");
}

console.log(keyframes(3));
`,
      expectedOutput: "0%, 50%, 100%",
      language: "javascript",
      difficulty: "hard",
    },
    {
      id: "c12-p3",
      title: "Practice #3 — Reduced Motion",
      description:
        "Respect the user's motion preference by choosing a duration.",
      instructions: [
        "Write `duration(prefersReduced)`.",
        "Return `0` if the user prefers reduced motion, else `300`.",
        "Call it with `true` and print the result.",
      ],
      starterCode:
`function duration(prefersReduced) {
  // your logic
}

console.log(duration(true));
`,
      expectedOutput: "0",
      language: "javascript",
      difficulty: "easy",
    },
  ],

 
  "13": [
    {
      id: "c13-p1",
      title: "Practice #1 — Rendering Strategy",
      description:
        "Choose a Next.js rendering strategy based on the data type.",
      instructions: [
        "Write `strategy(kind)`.",
        "Return `'SSG'` for `'static'`, `'SSR'` for `'dynamic'`, else `'ISR'`.",
        "Call it with `'dynamic'` and print the result.",
      ],
      starterCode:
`function strategy(kind) {
  // map kind to strategy
}

console.log(strategy("dynamic"));
`,
      expectedOutput: "SSR",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c13-p2",
      title: "Practice #2 — File-based Route",
      description:
        "Convert a file path into a Next.js route.",
      instructions: [
        "Given `const file = 'app/blog/page.tsx'`.",
        "Convert it to the route `'/blog'` (strip `app`, `page.tsx`).",
        "Print the route.",
      ],
      starterCode:
`const file = "app/blog/page.tsx";

const route = ""; // derive the route

console.log(route);
`,
      expectedOutput: "/blog",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c13-p3",
      title: "Practice #3 — Dynamic Segment",
      description:
        "Build a dynamic route segment folder name.",
      instructions: [
        "Write `dynamicSegment(param)` returning `'[<param>]'`.",
        "Call it with `'id'` and print the result.",
      ],
      starterCode:
`function dynamicSegment(param) {
  // return "[param]"
}

console.log(dynamicSegment("id"));
`,
      expectedOutput: "[id]",
      language: "javascript",
      difficulty: "easy",
    },
  ],


  "14": [
    {
      id: "c14-p1",
      title: "Practice #1 — Auth Guard",
      description:
        "Server components must guard protected data.",
      instructions: [
        "Write `canAccess(session)` where session may be `null`.",
        "Return `true` if session exists, else `false`.",
        "Call it with `null` and print the result.",
      ],
      starterCode:
`function canAccess(session) {
  // truthy check
}

console.log(canAccess(null));
`,
      expectedOutput: "false",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c14-p2",
      title: "Practice #2 — Server Action Result",
      description:
        "A server action mutates data then returns a status.",
      instructions: [
        "Write async `savePost(title)`; if title is non-empty resolve `'saved'`, else `'error'`.",
        "In `main()`, await `savePost('Hello')` and print the result.",
        "Call `main()`.",
      ],
      starterCode:
`async function savePost(title) {
  // return "saved" or "error"
}

async function main() {
  console.log(await savePost("Hello"));
}

main();
`,
      expectedOutput: "saved",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c14-p3",
      title: "Practice #3 — Env Variable Fallback",
      description:
        "Read an env variable with a safe default.",
      instructions: [
        "Given `const env = { API_URL: undefined }`.",
        "Read `API_URL`, defaulting to `'http://localhost'`.",
        "Print the resolved value.",
      ],
      starterCode:
`const env = { API_URL: undefined };

const url = ""; // read with a default

console.log(url);
`,
      expectedOutput: "http://localhost",
      language: "javascript",
      difficulty: "easy",
    },
  ],

  
  "15": [
    {
      id: "c15-p1",
      title: "Practice #1 — Debounce Counter (logic)",
      description:
        "Reason about how many times a debounced call actually fires.",
      instructions: [
        "A debounce only fires once per burst of calls.",
        "Given 5 rapid calls in one burst, how many times does it fire?",
        "Print exactly: `Fires: <n>`.",
      ],
      starterCode:
`const callsInBurst = 5;

const fires = 0; // how many times a debounced fn fires per burst

console.log(\`Fires: \${fires}\`);
`,
      expectedOutput: "Fires: 1",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c15-p2",
      title: "Practice #2 — Two Sum",
      description:
        "A classic interview problem. Find indices that sum to a target.",
      instructions: [
        "Given `const nums = [2, 7, 11]` and `target = 9`.",
        "Find the two indices whose values sum to the target.",
        "Print them as `'<i>,<j>'` (here `'0,1'`).",
      ],
      starterCode:
`const nums = [2, 7, 11];
const target = 9;

let result = "";
// find the two indices

console.log(result);
`,
      expectedOutput: "0,1",
      language: "javascript",
      difficulty: "hard",
    },
    {
      id: "c15-p3",
      title: "Practice #3 — Reconciliation Keys",
      description:
        "Explain why keys matter: detect duplicate keys in a list.",
      instructions: [
        "Given `const keys = ['a', 'b', 'a']`.",
        "Determine if all keys are unique.",
        "Print `true` if unique, otherwise `false`.",
      ],
      starterCode:
`const keys = ["a", "b", "a"];

const allUnique = false; // compute using a Set

console.log(allUnique);
`,
      expectedOutput: "false",
      language: "javascript",
      difficulty: "medium",
    },
  ],

  
  "16": [
    {
      id: "c16-p1",
      title: "Practice #1 — Conventional Commit",
      description:
        "Format a conventional commit message.",
      instructions: [
        "Write `commit(type, msg)` returning `'<type>: <msg>'`.",
        "Call it with `'feat'` and `'add login'`, print the result.",
      ],
      starterCode:
`function commit(type, msg) {
  // return "type: msg"
}

console.log(commit("feat", "add login"));
`,
      expectedOutput: "feat: add login",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c16-p2",
      title: "Practice #2 — Branch Name Slug",
      description:
        "Turn a feature title into a valid branch name.",
      instructions: [
        "Given `const title = 'Add User Profile'`.",
        "Lowercase it and replace spaces with hyphens, prefix with `'feature/'`.",
        "Print the branch name.",
      ],
      starterCode:
`const title = "Add User Profile";

const branch = ""; // build "feature/add-user-profile"

console.log(branch);
`,
      expectedOutput: "feature/add-user-profile",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c16-p3",
      title: "Practice #3 — Semantic Version Bump",
      description:
        "Bump a semantic version's minor number.",
      instructions: [
        "Given `const version = '1.4.2'`.",
        "Increment the minor version and reset patch to 0 → `'1.5.0'`.",
        "Print the new version.",
      ],
      starterCode:
`const version = "1.4.2";

const [major, minor, patch] = version.split(".").map(Number);
const next = ""; // build the bumped version

console.log(next);
`,
      expectedOutput: "1.5.0",
      language: "javascript",
      difficulty: "hard",
    },
  ],

  
  "17": [
    {
      id: "c17-p1",
      title: "Practice #1 — A Pure Function to Test",
      description:
        "Write a testable pure function and verify it yourself.",
      instructions: [
        "Write `add(a, b)` returning their sum.",
        "Call it with `2` and `3` and print the result.",
      ],
      starterCode:
`function add(a, b) {
  // return the sum
}

console.log(add(2, 3));
`,
      expectedOutput: "5",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c17-p2",
      title: "Practice #2 — A Simple Assertion",
      description:
        "Recreate the core idea of expect(...).toBe(...).",
      instructions: [
        "Write `expectToBe(actual, expected)`.",
        "Return `'PASS'` if they are strictly equal, else `'FAIL'`.",
        "Call it with `4` and `4` and print the result.",
      ],
      starterCode:
`function expectToBe(actual, expected) {
  // compare and return PASS / FAIL
}

console.log(expectToBe(4, 4));
`,
      expectedOutput: "PASS",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c17-p3",
      title: "Practice #3 — Mocking an Async Response",
      description:
        "Mock a network call (like MSW) and use its result.",
      instructions: [
        "`mockFetch()` returns a promise resolving to `{ ok: true }`.",
        "In `main()`, await it and print `'ok'` if `ok` is true.",
        "Call `main()`.",
      ],
      starterCode:
`function mockFetch() {
  return Promise.resolve({ ok: true });
}

async function main() {
  // await and print "ok" when ok is true
}

main();
`,
      expectedOutput: "ok",
      language: "javascript",
      difficulty: "hard",
    },
  ],


  "18": [
    {
      id: "c18-p1",
      title: "Practice #1 — Reading an Env Var",
      description:
        "Vite exposes env vars via import.meta.env. Simulate reading one.",
      instructions: [
        "Given `const env = { MODE: 'production' }`.",
        "Print exactly: `Mode: production`.",
      ],
      starterCode:
`const env = { MODE: "production" };

console.log(\`Mode: \${env.MODE}\`);
`,
      expectedOutput: "Mode: production",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c18-p2",
      title: "Practice #2 — Format Bundle Size",
      description:
        "Format a byte count into kilobytes, like a bundle analyzer.",
      instructions: [
        "Given `const bytes = 2048`.",
        "Convert to KB (divide by 1024) and print `'2 KB'`.",
      ],
      starterCode:
`const bytes = 2048;

const kb = 0; // bytes / 1024

console.log(\`\${kb} KB\`);
`,
      expectedOutput: "2 KB",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c18-p3",
      title: "Practice #3 — Lint Rule Check",
      description:
        "Simulate a lint rule that forbids `var`.",
      instructions: [
        "Write `lint(line)` that returns `'error'` if the line contains `'var '`, else `'ok'`.",
        "Call it with `'var x = 1'` and print the result.",
      ],
      starterCode:
`function lint(line) {
  // check for "var "
}

console.log(lint("var x = 1"));
`,
      expectedOutput: "error",
      language: "javascript",
      difficulty: "medium",
    },
  ],

  
  "19": [
    {
      id: "c19-p1",
      title: "Practice #1 — Fluid Percentage Width",
      description:
        "Compute a column width as a percentage of its container.",
      instructions: [
        "A row has `4` equal columns.",
        "Compute each column's width as a percentage string, e.g. `'25%'`.",
        "Print it.",
      ],
      starterCode:
`const columns = 4;

const width = ""; // "25%"

console.log(width);
`,
      expectedOutput: "25%",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c19-p2",
      title: "Practice #2 — Aspect Ratio Height",
      description:
        "Keep a 16:9 aspect ratio: compute height from width.",
      instructions: [
        "Given `const width = 320`.",
        "Compute the 16:9 height (width * 9 / 16), rounded.",
        "Print exactly: `Height: <n>`.",
      ],
      starterCode:
`const width = 320;

const height = 0; // width * 9 / 16, rounded

console.log(\`Height: \${height}\`);
`,
      expectedOutput: "Height: 180",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c19-p3",
      title: "Practice #3 — srcset Builder",
      description:
        "Build an image srcset string for two resolutions.",
      instructions: [
        "Given `const img = 'photo'`.",
        "Build `'photo-1x.jpg 1x, photo-2x.jpg 2x'`.",
        "Print the srcset.",
      ],
      starterCode:
`const img = "photo";

const srcset = ""; // build the srcset

console.log(srcset);
`,
      expectedOutput: "photo-1x.jpg 1x, photo-2x.jpg 2x",
      language: "javascript",
      difficulty: "hard",
    },
  ],

  
  "20": [
    {
      id: "c20-p1",
      title: "Practice #1 — Type Guard",
      description:
        "Type guards narrow a value at runtime. Write one for strings.",
      instructions: [
        "Write `isString(v)` returning `true` only if `v` is a string.",
        "Call it with `'hi'` and print the result.",
      ],
      starterCode:
`function isString(v) {
  // typeof check
}

console.log(isString("hi"));
`,
      expectedOutput: "true",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c20-p2",
      title: "Practice #2 — Pick Keys (Omit/Pick idea)",
      description:
        "Recreate Pick: build a new object with only chosen keys.",
      instructions: [
        "Given `const obj = { a: 1, b: 2, c: 3 }` and `keys = ['a', 'c']`.",
        "Build a new object with only those keys.",
        "Print it as JSON.",
      ],
      starterCode:
`const obj = { a: 1, b: 2, c: 3 };
const keys = ["a", "c"];

const picked = {}; // keep only chosen keys

console.log(JSON.stringify(picked));
`,
      expectedOutput: `{"a":1,"c":3}`,
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c20-p3",
      title: "Practice #3 — Recursive Sum (recursive types idea)",
      description:
        "Recursion mirrors recursive type structures. Sum a nested array.",
      instructions: [
        "Given `const data = [1, [2, [3, 4]]]`.",
        "Recursively sum all numbers.",
        "Print exactly: `Sum: 10`.",
      ],
      starterCode:
`const data = [1, [2, [3, 4]]];

function sum(arr) {
  // recurse into nested arrays
}

console.log(\`Sum: \${sum(data)}\`);
`,
      expectedOutput: "Sum: 10",
      language: "javascript",
      difficulty: "hard",
    },
  ],

  
  "21": [
    {
      id: "c21-p1",
      title: "Practice #1 — Alt Text Presence",
      description:
        "Every meaningful image needs alt text. Check for it.",
      instructions: [
        "Write `hasAlt(img)` where img is `{ alt }`.",
        "Return `true` if alt is a non-empty string, else `false`.",
        "Call it with `{ alt: 'Logo' }` and print the result.",
      ],
      starterCode:
`function hasAlt(img) {
  // check img.alt
}

console.log(hasAlt({ alt: "Logo" }));
`,
      expectedOutput: "true",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c21-p2",
      title: "Practice #2 — Tab Order",
      description:
        "Sort focusable elements by their tabindex.",
      instructions: [
        "Given `const els = [{ id: 'a', tab: 2 }, { id: 'b', tab: 1 }]`.",
        "Sort ascending by `tab` and print the ids joined by a comma.",
      ],
      starterCode:
`const els = [{ id: "a", tab: 2 }, { id: "b", tab: 1 }];

const order = [...els]; // sort by tab

console.log(order.map(e => e.id).join(","));
`,
      expectedOutput: "b,a",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c21-p3",
      title: "Practice #3 — Contrast Pass",
      description:
        "Check if a contrast ratio meets the WCAG AA threshold (4.5).",
      instructions: [
        "Write `passesAA(ratio)`.",
        "Return `'pass'` if ratio >= 4.5, else `'fail'`.",
        "Call it with `3.0` and print the result.",
      ],
      starterCode:
`function passesAA(ratio) {
  // compare with 4.5
}

console.log(passesAA(3.0));
`,
      expectedOutput: "fail",
      language: "javascript",
      difficulty: "easy",
    },
  ],

  
  "22": [
    {
      id: "c22-p1",
      title: "Practice #1 — Design Token Lookup",
      description:
        "Design tokens map names to values. Read one from a token map.",
      instructions: [
        "Given `const tokens = { 'color-primary': '#3366ff' }`.",
        "Read the `'color-primary'` token.",
        "Print exactly: `Primary: #3366ff`.",
      ],
      starterCode:
`const tokens = { "color-primary": "#3366ff" };

console.log(\`Primary: \${tokens["color-primary"]}\`);
`,
      expectedOutput: "Primary: #3366ff",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c22-p2",
      title: "Practice #2 — Theme Toggle",
      description:
        "Toggle between light and dark theme values.",
      instructions: [
        "Write `toggleTheme(current)`.",
        "Return `'dark'` if current is `'light'`, otherwise `'light'`.",
        "Call it with `'light'` and print the result.",
      ],
      starterCode:
`function toggleTheme(current) {
  // flip the theme
}

console.log(toggleTheme("light"));
`,
      expectedOutput: "dark",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c22-p3",
      title: "Practice #3 — Variant Class Builder",
      description:
        "Build a component's class string from its variant props.",
      instructions: [
        "Write `btnClass(variant, size)` returning `'btn btn-<variant> btn-<size>'`.",
        "Call it with `'primary'` and `'lg'`, print the result.",
      ],
      starterCode:
`function btnClass(variant, size) {
  // build the class string
}

console.log(btnClass("primary", "lg"));
`,
      expectedOutput: "btn btn-primary btn-lg",
      language: "javascript",
      difficulty: "medium",
    },
  ],

  
  "23": [
    {
      id: "c23-p1",
      title: "Practice #1 — px to rem",
      description:
        "Convert a Figma pixel value to rem (base 16).",
      instructions: [
        "Write `pxToRem(px)` (base 16) returning `'<value>rem'`.",
        "Call it with `24` and print the result (`'1.5rem'`).",
      ],
      starterCode:
`function pxToRem(px) {
  // px / 16 + "rem"
}

console.log(pxToRem(24));
`,
      expectedOutput: "1.5rem",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c23-p2",
      title: "Practice #2 — Auto Layout Gap to CSS",
      description:
        "Translate a Figma auto-layout gap into a CSS declaration.",
      instructions: [
        "Given `const gap = 12`.",
        "Produce the CSS declaration `'gap: 12px;'`.",
        "Print it.",
      ],
      starterCode:
`const gap = 12;

const css = ""; // "gap: 12px;"

console.log(css);
`,
      expectedOutput: "gap: 12px;",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c23-p3",
      title: "Practice #3 — Variant to Props",
      description:
        "Map a Figma variant string into React prop object.",
      instructions: [
        "Given `const variant = 'State=Hover, Size=Large'`.",
        "Parse it into `{ State: 'Hover', Size: 'Large' }`.",
        "Print it as JSON.",
      ],
      starterCode:
`const variant = "State=Hover, Size=Large";

const props = {};
// split by ", " then by "=" into key/value pairs

console.log(JSON.stringify(props));
`,
      expectedOutput: `{"State":"Hover","Size":"Large"}`,
      language: "javascript",
      difficulty: "hard",
    },
  ],

 
  "24": [
    {
      id: "c24-p1",
      title: "Practice #1 — Rename for Clarity",
      description:
        "Good names remove the need for comments. Return a clear label.",
      instructions: [
        "You have a total price `t = 42`.",
        "Print a clearly labelled output: `Total price: 42`.",
      ],
      starterCode:
`const t = 42;

console.log(\`Total price: \${t}\`);
`,
      expectedOutput: "Total price: 42",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c24-p2",
      title: "Practice #2 — Extract a Function",
      description:
        "Decompose logic into a small, named, reusable function.",
      instructions: [
        "Write `isEven(n)` returning `true`/`false`.",
        "Use it to check `10` and print the result.",
      ],
      starterCode:
`function isEven(n) {
  // return whether n is even
}

console.log(isEven(10));
`,
      expectedOutput: "true",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c24-p3",
      title: "Practice #3 — Guard Clause",
      description:
        "Replace nested conditions with an early return (guard clause).",
      instructions: [
        "Write `discount(price)`; if price <= 0 return `0` immediately.",
        "Otherwise return `price * 0.9`.",
        "Call it with `100` and print the result.",
      ],
      starterCode:
`function discount(price) {
  // guard clause first, then main logic
}

console.log(discount(100));
`,
      expectedOutput: "90",
      language: "javascript",
      difficulty: "medium",
    },
  ],


  "25": [
    {
      id: "c25-p1",
      title: "Practice #1 — Class Combiner",
      description:
        "Combine base and conditional Tailwind classes.",
      instructions: [
        "Write `cx(base, isActive)`.",
        "Return `base + ' active'` if isActive, otherwise just `base`.",
        "Call it with `'btn'` and `true`, print the result.",
      ],
      starterCode:
`function cx(base, isActive) {
  // conditionally append "active"
}

console.log(cx("btn", true));
`,
      expectedOutput: "btn active",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c25-p2",
      title: "Practice #2 — Responsive Prefix",
      description:
        "Add a Tailwind breakpoint prefix to a utility class.",
      instructions: [
        "Write `responsive(bp, cls)` returning `'<bp>:<cls>'`.",
        "Call it with `'md'` and `'flex'`, print the result.",
      ],
      starterCode:
`function responsive(bp, cls) {
  // return "bp:cls"
}

console.log(responsive("md", "flex"));
`,
      expectedOutput: "md:flex",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c25-p3",
      title: "Practice #3 — Spacing Utility",
      description:
        "Map a spacing step to a Tailwind padding class.",
      instructions: [
        "Tailwind's `p-<n>` equals `n * 4` px.",
        "Write `paddingPx(n)` returning the pixel value for `p-<n>`.",
        "Call it with `4` and print the result (`16`).",
      ],
      starterCode:
`function paddingPx(n) {
  // n * 4
}

console.log(paddingPx(4));
`,
      expectedOutput: "16",
      language: "javascript",
      difficulty: "medium",
    },
  ],

  
  "26": [
    {
      id: "c26-p1",
      title: "Practice #1 — Memoize (cache) Results",
      description:
        "Recreate the idea of useMemo: cache a computed value.",
      instructions: [
        "Create a cache object.",
        "Write `square(n)` that stores results in the cache and reuses them.",
        "Call `square(4)` and print the result.",
      ],
      starterCode:
`const cache = {};

function square(n) {
  // return cached result if present, else compute and store
}

console.log(square(4));
`,
      expectedOutput: "16",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c26-p2",
      title: "Practice #2 — Skip Unnecessary Work",
      description:
        "React.memo skips re-renders when props are equal. Model that check.",
      instructions: [
        "Write `shouldRender(prev, next)` for props `{ value }`.",
        "Return `false` if values are equal (skip), else `true`.",
        "Call it with `{ value: 5 }` and `{ value: 5 }`, print the result.",
      ],
      starterCode:
`function shouldRender(prev, next) {
  // compare prev.value and next.value
}

console.log(shouldRender({ value: 5 }, { value: 5 }));
`,
      expectedOutput: "false",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c26-p3",
      title: "Practice #3 — Virtualized Window",
      description:
        "List virtualization renders only visible rows. Compute that count.",
      instructions: [
        "A list viewport is `500` px tall, each row is `50` px.",
        "Compute how many rows are visible at once.",
        "Print exactly: `Visible: <n>`.",
      ],
      starterCode:
`const viewport = 500;
const rowHeight = 50;

const visible = 0; // compute

console.log(\`Visible: \${visible}\`);
`,
      expectedOutput: "Visible: 10",
      language: "javascript",
      difficulty: "easy",
    },
  ],

  
  "27": [
    {
      id: "c27-p1",
      title: "Practice #1 — Translation Lookup",
      description:
        "Read a translated string from a dictionary.",
      instructions: [
        "Given `const dict = { greeting: 'Salam' }`.",
        "Look up the `'greeting'` key and print its value.",
      ],
      starterCode:
`const dict = { greeting: "Salam" };

console.log(dict["greeting"]);
`,
      expectedOutput: "Salam",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c27-p2",
      title: "Practice #2 — Pluralization",
      description:
        "Choose singular or plural based on a count.",
      instructions: [
        "Write `plural(n)` returning `'<n> item'` if n === 1, else `'<n> items'`.",
        "Call it with `3` and print the result.",
      ],
      starterCode:
`function plural(n) {
  // singular vs plural
}

console.log(plural(3));
`,
      expectedOutput: "3 items",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c27-p3",
      title: "Practice #3 — Missing Key Fallback",
      description:
        "When a translation is missing, fall back to the key itself.",
      instructions: [
        "Given `const dict = { hello: 'Hi' }`.",
        "Write `t(key)` returning the translation, or the key if missing.",
        "Call `t('bye')` and print the result.",
      ],
      starterCode:
`const dict = { hello: "Hi" };

function t(key) {
  // return dict[key] or key
}

console.log(t("bye"));
`,
      expectedOutput: "bye",
      language: "javascript",
      difficulty: "easy",
    },
  ],

  
  "28": [
    {
      id: "c28-p1",
      title: "Practice #1 — Select Requested Fields",
      description:
        "GraphQL returns exactly the fields you ask for. Simulate that.",
      instructions: [
        "Given `const user = { id: 1, name: 'Ada', email: 'a@x.com' }`.",
        "Return an object with only `id` and `name`.",
        "Print it as JSON.",
      ],
      starterCode:
`const user = { id: 1, name: "Ada", email: "a@x.com" };

const selected = {}; // keep only id and name

console.log(JSON.stringify(selected));
`,
      expectedOutput: `{"id":1,"name":"Ada"}`,
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c28-p2",
      title: "Practice #2 — Query Variables",
      description:
        "Inject variables into a GraphQL-style operation.",
      instructions: [
        "Write `buildVars(id)` returning `{ id }` as a JSON string.",
        "Call it with `5` and print the result.",
      ],
      starterCode:
`function buildVars(id) {
  // return { id } as JSON
}

console.log(buildVars(5));
`,
      expectedOutput: `{"id":5}`,
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c28-p3",
      title: "Practice #3 — Cache Identity Key",
      description:
        "Apollo normalizes cache by typename:id. Build that key.",
      instructions: [
        "Write `cacheId(typename, id)` returning `'<typename>:<id>'`.",
        "Call it with `'User'` and `1`, print the result.",
      ],
      starterCode:
`function cacheId(typename, id) {
  // return "typename:id"
}

console.log(cacheId("User", 1));
`,
      expectedOutput: "User:1",
      language: "javascript",
      difficulty: "easy",
    },
  ],

  
  "29": [
    {
      id: "c29-p1",
      title: "Practice #1 — Avoid Prop Drilling (flatten)",
      description:
        "Pull a deeply nested value up to a flat variable.",
      instructions: [
        "Given `const data = { a: { b: { c: 'deep' } } }`.",
        "Read the nested `c` value.",
        "Print exactly: `Value: deep`.",
      ],
      starterCode:
`const data = { a: { b: { c: "deep" } } };

const value = ""; // read the nested value

console.log(\`Value: \${value}\`);
`,
      expectedOutput: "Value: deep",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c29-p2",
      title: "Practice #2 — Container vs Presentational",
      description:
        "Separate data logic from presentation.",
      instructions: [
        "Write `presenter(user)` that takes `{ first, last }`.",
        "Return the full name `'<first> <last>'`.",
        "Call it with `{ first: 'Nur', last: 'Aliyev' }`, print the result.",
      ],
      starterCode:
`function presenter(user) {
  // build full name
}

console.log(presenter({ first: "Nur", last: "Aliyev" }));
`,
      expectedOutput: "Nur Aliyev",
      language: "javascript",
      difficulty: "easy",
    },
    {
      id: "c29-p3",
      title: "Practice #3 — Composition over Inheritance",
      description:
        "Compose behavior by merging config objects.",
      instructions: [
        "Given `const base = { padding: 4 }` and `const extra = { margin: 8 }`.",
        "Compose them into one config object.",
        "Print it as JSON.",
      ],
      starterCode:
`const base = { padding: 4 };
const extra = { margin: 8 };

const composed = {}; // merge base and extra

console.log(JSON.stringify(composed));
`,
      expectedOutput: `{"padding":4,"margin":8}`,
      language: "javascript",
      difficulty: "medium",
    },
  ],

  
  "30": [
    {
      id: "c30-p1",
      title: "Practice #1 — Filter the Course Catalog",
      description:
        "Filter courses by category, like the catalog search panel.",
      instructions: [
        "Given the courses array below and `category = 'frontend'`.",
        "Return only the courses in that category.",
        "Print their titles joined by a comma.",
      ],
      starterCode:
`const courses = [
  { title: "React", category: "frontend" },
  { title: "Express", category: "backend" },
  { title: "Tailwind", category: "frontend" },
];
const category = "frontend";

const result = courses.filter(c => /* your filter */ true);

console.log(result.map(c => c.title).join(", "));
`,
      expectedOutput: "React, Tailwind",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c30-p2",
      title: "Practice #2 — Sync Filter to URL",
      description:
        "Turn active filters into a URL query string.",
      instructions: [
        "Given `const filters = { category: 'frontend', level: 'beginner' }`.",
        "Build the query string `'category=frontend&level=beginner'`.",
        "Print it.",
      ],
      starterCode:
`const filters = { category: "frontend", level: "beginner" };

const query = Object.entries(filters)
  .map(([k, v]) => /* "k=v" */ "")
  .join("&");

console.log(query);
`,
      expectedOutput: "category=frontend&level=beginner",
      language: "javascript",
      difficulty: "medium",
    },
    {
      id: "c30-p3",
      title: "Practice #3 — Total Course Duration",
      description:
        "Sum the lesson hours to show total course time, like the syllabus.",
      instructions: [
        "Given `const hours = ['6h', '6h', '5h']` (strings ending in 'h').",
        "Parse the numbers and sum them.",
        "Print exactly: `Total: 17h`.",
      ],
      starterCode:
`const hours = ["6h", "6h", "5h"];

const total = hours.reduce((sum, h) => sum + parseInt(h), 0);

console.log(\`Total: \${total}h\`);
`,
      expectedOutput: "Total: 17h",
      language: "javascript",
      difficulty: "hard",
    },
  ],
};



const DEFAULT_PRACTICES: CodePractice[] = [
  {
    id: "d0",
    title: "Practice #1 — Variables & Output",
    description:
      "Practice declaring variables and printing values.",
    instructions: [
      "Create a constant called `studentName` with your own name.",
      "Create a constant called `hoursStudied` with the number 2.",
      "Print exactly: `Hello, <studentName>! You have studied for <hoursStudied> hours.`",
    ],
    starterCode:
`const studentName = "";
const hoursStudied = 0;

console.log(\`Hello, \${studentName}! You have studied for \${hoursStudied} hours.\`);
`,
    expectedOutput: "Hello, Alex! You have studied for 2 hours.",
    language: "javascript",
    difficulty: "easy",
  },
  {
    id: "d1",
    title: "Practice #2 — Functions & Conditions",
    description:
      "Wrap logic in a function and return a value based on a condition.",
    instructions: [
      "Write a function called `gradeFor(score)`.",
      "If `score >= 90` return `'A'`; if `score >= 75` return `'B'`; otherwise `'C'`.",
      "Call the function with `82` and print the result.",
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
    id: "d2",
    title: "Practice #3 — Loops & Arrays",
    description: "Iterate over an array and compute a summary value.",
    instructions: [
      "You are given `const numbers = [4, 8, 15, 16, 23, 42]`.",
      "Compute the sum of all numbers using a loop.",
      "Print exactly: `Total: <sum>`.",
    ],
    starterCode:
`const numbers = [4, 8, 15, 16, 23, 42];
let sum = 0;

console.log(\`Total: \${sum}\`);
`,
    expectedOutput: "Total: 108",
    language: "javascript",
    difficulty: "medium",
  },
];


export function getPracticesForCourse(
  lessonCount: number,
  courseId?: string | number
): CodePractice[] {
  if (courseId != null) {
    const set = PRACTICES_BY_COURSE[String(courseId)];
    if (set && set.length) {
      return set.map((p, i) => ({ ...p, id: `practice-${i + 1}` }));
    }
  }

  const pairs = Math.max(1, Math.floor(lessonCount / 2));
  const practices: CodePractice[] = [];
  for (let i = 0; i < pairs; i++) {
    const template = DEFAULT_PRACTICES[i % DEFAULT_PRACTICES.length];
    practices.push({
      ...template,
      id: `practice-${i + 1}`,
      title: template.title.replace(/^Practice #\d+/, `Practice #${i + 1}`),
    });
  }
  return practices;
}
