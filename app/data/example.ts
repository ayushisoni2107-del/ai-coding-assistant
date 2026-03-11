export const samplePrompt = [
  "Create a function that reverses a string",
  "Implement a todo list component in React",
  "Write a Python script to download files from URL",
  "Create a REST API endpoint for user authentication",
];
export const sampleCode = `// Sample : Fibonacci function
// function fibonacci(n){
//  if(n <= 1) return n;
// return fibonacci(n-1) + fibonacci(n-2);}`;

export const sampleBuggyCode = `function calcuateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export const languages = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "TypeScript",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
]

export const sampleDebugCode = ` function calcuateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;
