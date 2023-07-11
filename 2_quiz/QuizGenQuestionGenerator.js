// Used as a cache
var quizzes;
var amountQuizzes = 20;
var counter = amountQuizzes;


// Quiz refers to question and set of answers
function getQuiz(){
    if(counter == amountQuizzes){
        quizzes = getXQuizzes();
        counter = 0;
    }

    var currentQuiz = quizzes[counter];

    counter++;
    
    return currentQuiz;
}

function findQuestion(searchQuestion){
    console.log('Had to use linear search with question', searchQuestion, ' and index ', index);
    for (var index = 0; index < amountQuizzes; index++) {
        const element = array[index];
        if(searchQuestion === element.Question){
            return index;
        }
    }
    return -1;
}

function checkAnswer(searchQuestion, givenIndex){
    var questionIndex = counter - 1;

    if(!searchQuestion === quizzes[questionIndex].Question){
        // If the question is not the most recent used question, then search for it
        questionIndex = findQuestion(searchQuestion);
        if(questionIndex == -1){
            console.log('Error: the question is not in the stack');
            return false;
        }
    }


    if(givenIndex == quizzes[questionIndex].Correct_Answer_Index)
        return true;

    return false;
}

function getXQuizzes(){
    var retrieved = [
        {
          "Question": "What is the name of the street that runs from the White House to the Capitol and is used for ceremonial parades?",
          "Answers": ["Pennsylvania Avenue", "Broadway", "Star Walk", "Fifth Avenue"],
          "Correct_Answer_Index": 0
        },
        {
          "Question": "Which singer released the song 'Only Girl (In the World)'?",
          "Answers": ["Ricky Martin", "Rihanna", "Drake", "Nicki Minaj"],
          "Correct_Answer_Index": 1
        },
        {
          "Question": "Durban is a city in which country?",
          "Answers": [
            "South Africa",
            "Democratic Republic of the Congo",
            "Senegal",
            "Nigeria"
          ],
          "Correct_Answer_Index": 0
        },
        {
            "Question": "What Italian philosopher and writer was known for his deviousness, having a scheming personality trait named after him?",
            "Answers": ["Boccaccio", "Galileo", "Machiavelli", "Dante"],
            "Correct_Answer_Index": 2
          },
          {
            "Question": "In which year did Sirimavo Bandaranaike make history as the first woman elected head of a government?",
            "Answers": ["1971", "1941", "1980", "1960"],
            "Correct_Answer_Index": 3
          },
          {
            "Question": "What is Sindonology the study of?",
            "Answers": [
              "the functions of the nervous system",
              "the Shroud of Turin",
              "statistics such as births, deaths, income, or the incidence of disease, which illustrate the changing structure of human populations",
              "history, literature, art and culture of Iran"
            ],
            "Correct_Answer_Index": 1
          },
          {
            "Question": "Which country is also known as Suomi?",
            "Answers": ["Finland", "China", "Cambodia", "Brazil"],
            "Correct_Answer_Index": 0
          },{
            "Question": "Which film won the Academy Award for Best Picture in 1998?",
            "Answers": [
              "Life Is Beautiful",
              "Saving Private Ryan",
              "Elizabeth",
              "Shakespeare in Love"
            ],
            "Correct_Answer_Index": 3
          },
          {
            "Question": "What is the name of the Norse goddess of love and beauty?",
            "Answers": ["Idun", "Freyr", "Freyja", "Frigg"],
            "Correct_Answer_Index": 2
          },
          {
            "Question": "What song did Gary Numan have a hit with in 1980?",
            "Answers": [
              "Somebody's Watching Me",
              "Cars",
              "I Know What Boys Like",
              "Heart And Soul"
            ],
            "Correct_Answer_Index": 1
          },
          {
            "Question": "Who banned Christmas Carol's in England between the years of 1649 and 1660?",
            "Answers": ["Henry VIII", "James I", "Oliver Cromwell", "Victoria"],
            "Correct_Answer_Index": 2
          },
          {
            "Question": "Which author wrote 'Pippi Longstocking'?",
            "Answers": [
              "Charles Perrault",
              "Enid Blyton",
              "Beatrix Potter",
              "Astrid Lindgren"
            ],
            "Correct_Answer_Index": 3
          },
          {
            "Question": "What is the Chemical Element Pa?",
            "Answers": ["Potassium", "Lead", "Palladium", "Protactinium"],
            "Correct_Answer_Index": 3
          },
          {
            "Question": "With which sport is Paula Radcliffe associated?",
            "Answers": ["Gymnastics", "Rugby Union", "Skiing", "Athletics"],
            "Correct_Answer_Index": 3
          },
          {
            "Question": "In what animal form did Zeus seduce Europa?",
            "Answers": ["Horse", "Bull", "Eagle", "Dolphin"],
            "Correct_Answer_Index": 1
          },
          {
            "Question": "Who won the 2018 Academy Award for Best Leading Actor for playing the role of Freddie Mercury in Bohemian Rhapsody?",
            "Answers": [
              "Christian Bale",
              "Willem Dafoe",
              "Rami Malek",
              "Bradley Cooper"
            ],
            "Correct_Answer_Index": 2
          },
          {
            "Question": "What simple type of 'camera' uses a hole in a screen to create a simply-viewed image of the sun?",
            "Answers": ["Periscope", "Bridge camera", "Box camera", "Camera obscura"],
            "Correct_Answer_Index": 3
          },
          {
            "Question": "Name the movie that matches the following plot summary: 'A hacker discovers the life he knows is the elaborate deception of an evil cyber-intelligence.'",
            "Answers": [
              "The Big Lebowski",
              "Seven",
              "The Lord of the Rings: The Fellowship of the Ring",
              "The Matrix"
            ],
            "Correct_Answer_Index": 3
          },
          {
            "Question": "What do the letters 'FWIW' mean on internet chats?",
            "Answers": [
              "Friend who is wise",
              "Fantastic when it works",
              "For what it's worth",
              "For while I'm waiting"
            ],
            "Correct_Answer_Index": 2
          },
          {
            "Question": "What is the French word for an overused or stereotyped phrase?",
            "Answers": ["Expose", "Cliche", "Passepartout", "Bonjour"],
            "Correct_Answer_Index": 1
          }
    ]
    // var retrieved = '';

    return retrieved;
}

// // TEST CODE START
// for (let index = 0; index < amountQuizzes; index++) {
//     var testQuiz = getQuiz();
//     console.log(testQuiz)
//     console.log(testQuiz.Question);
//     console.log(testQuiz.Answers);
//     console.log(testQuiz.Correct_Answer_Index);
//     console.log('Is 2 the correct index: ', checkAnswer(testQuiz.Question, 2));
//     console.log();
// }
// TEST CODE END
module.exports = { checkAnswer, getQuiz };
