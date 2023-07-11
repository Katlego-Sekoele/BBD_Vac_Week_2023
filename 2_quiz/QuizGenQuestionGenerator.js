// Used as a cache
// var question, options, ansIndex;

// Quiz refers to question and set of answers
function getQuiz() {
  var question = "How many planets are there in our solar system?"; // TODO: change to database call
  var options = ["6", "7", "8", "9"]; // TODO: change to database call
  var ansIndex = 2; // TODO: change to database call
  var quiz = {
    Question: question,
    Answers: [options[0], options[1], options[2], options[3]],
    Correct_Answer_Index: ansIndex,
  };

  return quiz;
}

function checkAnswer(searchQuestion, answer) {
  if (!searchQuestion.equals(question)) {
    // If the question is not in the cache then populate the cache with it
    var question; // TODO: Change this to a database call
    var options; // TODO: Change this to a database call
    var ansIndex = -1; // TODO: Change this to a database call
  }

  if (answer == ansIndex) return true;
  return false;
}

// Might be removed
function generateQuestions(numQ) {
  // TODO: Api that generates questions
  var questions = [
    "How many planets are there in our solar system?",
    "Which Italian explorer discovered North America, thinking that it was India?",
  ];
  var options = [
    ["6", "7", "8", "9"],
    ["Marco Polo", "Mansa Musa", "Christopher Colombus", "Galileo Galilei"],
  ];

  var answerIndexes = [2, 2];
}

// TEST CODE START
var testQuiz = getQuiz();
console.log(testQuiz.Correct_Answer_Index);
console.log(testQuiz.Question);
console.log(testQuiz.Answers);
// TEST CODE END

module.exports = { generateQuestions, getQuiz };
