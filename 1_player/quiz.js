function sendAnswer(userInput)
{
    //create json object to send gameAnswer
    var quizJSON = '{"answer": '+ userInput + '}';

    console.log(userInput);
}

function quit()
{
    window.location.assign("connect.html");
}