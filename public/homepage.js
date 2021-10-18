//import the values from the home page
var Username = document.getElementById('username-input');
var button = document.getElementById('play-button');
const playMenu = document.getElementById('home-page');
playMenu.classList.remove('hidden');

//When the play button is clicked hide the homepage and generate the player with the given username
button.onclick = function(){

    playMenu.classList.add('hidden');
    startGame(Username.value)
}
