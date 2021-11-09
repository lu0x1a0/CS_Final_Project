class Leaderboard {

  constructor() {
    this.leaderBoard_update_counter = 0;
  }

  update(gameState) {


    this.leaderBoard_update_counter = this.leaderBoard_update_counter + 1
    if (this.leaderBoard_update_counter >= 40){
        var players = gameState.playerlist

        players.sort(function (x, y) {
          return y.gold - x.gold
        })
      this.leaderBoard_update_counter = 0
      const effects_list = document.getElementById("effects_list")

      var table = ""
      for (var i = 0; i < players.length; i++ ) {
        if (i >= 5 ) {break}
        table = table + "<tr><td>" + players[i].gold +"</td><td>" + " - "+ "</td><td>" + players[i].username + "</td></tr>"
      }



    }
  }

}
