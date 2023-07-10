function connectToLobby()
{
    console.log("Hier");
    

    var username = document.getElementById("usernameInput").value;
    var gameCode = document.getElementById("gameCodeInput").value;

    if (username=="" || gameCode=="" || username==null || gameCode==null)
    {
        alert("Input fields cannot be empty");
        return;
    }

    //create json object to send username and gamecode
    var connectJSON = '{"username": '+ username +', "gamecode" : '+ gameCode+'}';
    
    console.log(username + " " + gameCode);

    var result = "Success";

    //check whether request was successful
    if (result == "Success")
    {
        //redirect to lobby
        window.location.assign("lobby.html");
    }
    else
    {
        alert("Error connecting. Please try again.");
    }




    
}