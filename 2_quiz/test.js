import { getQuiz } from "./QuizGenQuestionGenerator.js";
var testQuiz = getQuiz();
console.log(testQuiz.Correct_Answer_Index);
console.log(testQuiz.Question);
console.log(testQuiz.Answers);