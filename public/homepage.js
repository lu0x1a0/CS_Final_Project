//import the values from the home page
var Username = document.getElementById('username-input');
var button = document.getElementById('play-button');
const playMenu = document.getElementById('home-page');
const effects_table = document.getElementById('effects_table');
playMenu.classList.remove('hidden');
effects_table.classList.add('hidden')


//When the play button is clicked hide the homepage and generate the player with the given username
button.onclick = function(){

    playMenu.classList.add('hidden');
    effects_table.classList.remove('hidden');
    startGame(Username.value)

}
