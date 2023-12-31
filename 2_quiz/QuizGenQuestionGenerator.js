// Used as a cache
var DEBUG = false;
var currQuizzes = new Array();
var allQuizzes = new Array();
var techQuizzes = new Array();
var amountQuizzes = 15;
var amountTechQuizzes = 5;
var counter = amountQuizzes;
var totalQuizCounter = 0;
var techCounter = 0;

/**
 * Quiz refers to question and set of answers
 * 
 * @returns JSON object of questions and answers 
 */
function getQuiz() {
    if (allQuizzes.length == 0)
        populateAllQuizzes();

    if (counter == amountQuizzes) {
        currQuizzes = getXQuizzes();
        counter = 0;
    }

    var currentQuiz = currQuizzes[counter];

    counter++;

    return currentQuiz;
}

/**
 * Helper method to search for question
 * @param {String} searchQuestion 
 * @returns 
 */
function findQuestion(searchQuestion) {
    console.log('Had to use linear search with question', searchQuestion, ' and index ', index);
    for (var index = 0; index < amountQuizzes; index++) {
        const element = array[index];
        if (searchQuestion === element.Question) {
            return index;
        }
    }
    return -1;
}

/**
 * 
 * @param {String} searchQuestion The current question being queried 
 * @param {Integer} givenIndex Index of a player's answer
 * @returns 
 */
function checkAnswer(searchQuestion, givenIndex) {
    var questionIndex = counter - 1;
    console.log('Question index is ', questionIndex);
    console.log('Search question is ', searchQuestion);
    if (questionIndex < amountQuizzes && questionIndex >= 0 && !searchQuestion === currQuizzes[questionIndex].Question) {
        // If the question is not the most recent used question, then search for it
        questionIndex = findQuestion(searchQuestion);
        if (questionIndex == -1) {
            console.log('Error: the question is not in the stack');
            return false;
        }
    }


    if (givenIndex == currQuizzes[questionIndex].Correct_Answer_Index)
        return true;

    return false;
}

/**
 * 
 * @returns Initializer of question arrays
 */
function getXQuizzes() {
    var retrieved = new Array();

    // Checks if the end is reached
    if (totalQuizCounter + amountQuizzes >= allQuizzes.length) {
        totalQuizCounter = 0;
    }

    // populates currQuizzes
    for (var i = 0; i < amountQuizzes; i++)
        retrieved[i] = allQuizzes[totalQuizCounter + i];

    // Checks if the end is reached
    if (techCounter + amountTechQuizzes >= techQuizzes.length) {
        techCounter = 0;
    }
    for (var i = 0; i < amountTechQuizzes; i++)
        retrieved.push(techQuizzes[techCounter + i]);
    totalQuizCounter += amountQuizzes;

    shuffle(retrieved);

    return retrieved;
}

// Author: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
/**
 * 
 * @param {String} array of questions 
 * @returns the shuffled questions
 */
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function populateAllQuizzes() {
    allQuizzes = require('./questions.json');
    techQuizzes = require('./techQuestions.json');

    allQuizzes = shuffle(allQuizzes);
    techQuizzes = shuffle(techQuizzes);
}

// TEST CODE START
if (DEBUG) {
    for (let index = 0; index < 1; index++) {
        var testQuiz = getQuiz();
        question = testQuiz.Question;
        console.log(testQuiz.Question);
        console.log(testQuiz.Answers);
        console.log(testQuiz.Correct_Answer_Index);
        console.log('Is 2 the correct index: ', checkAnswer(testQuiz.Question, 2));
        console.log();
    }

    console.log(testQuiz)
    console.log(checkAnswer(question, 0));
    console.log(checkAnswer(question, 1));
    console.log(checkAnswer(question, 2));
    console.log(checkAnswer(question, 3));
}
// TEST CODE END
module.exports = { checkAnswer, getQuiz };
