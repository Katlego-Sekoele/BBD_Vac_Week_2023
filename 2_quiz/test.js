const QuizGen = require("./QuizGenQuestionGenerator");
var testQuiz = QuizGen.getQuiz();
console.log(testQuiz.Correct_Answer_Index);
console.log(testQuiz.Question);
console.log(testQuiz.Answers);
