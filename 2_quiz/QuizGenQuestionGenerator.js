// Quiz refers to question and set of answers
function getQuizFromDatabase(){
    var question = 'How many planets are there in our solar system?'; // change to database call                
    var options = ['6', '7', '8', '9']; // change to database call

    var quiz = {
        "Question:": question,
        "Answers": [
            options[0],
            options[1],
            options[2],
            options[3]
        ],
    };

    return quiz;

}

function generateQuestions(numQ){
    // TODO: Api that generates questions
    var questions = ['How many planets are there in our solar system?',
                    'Which Italian explorer discovered North America, thinking that it was India?'
                    ];
    var options = [
        ['6', '7', '8', '9'],
        ['Marco Polo', 'Mansa Musa', 'Christopher Colombus', 'Galileo Galilei']
    ];

    var answerIndexes = [2, 2];


    return 
}