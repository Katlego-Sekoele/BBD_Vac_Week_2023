# Team 2
See QuizGenQuestionGenerator.js for the below mentioned APIs.

## Usage
```js
// Calls the methods withing QuizGenQuestionGenerator
const QuizGen = require("./QuizGenQuestionGenerator");

// Get the JSON object 
var currentQuestion = QuizGen.getQuiz();

// Pull the question from the object
var question = currentQuestion.Question;

// Pull the 4 options from the object
var possibleAnswers = QuizGen.getQuiz().Answers;

// Question is a string, answer index is a integer
for(let i=0; i<players.length;i+) {
    if(QuizGen.checkAnswer(question, answerIndex))
        // Streaking logic
}
```
## Rulesa
- main branch for this team should be `2_main`