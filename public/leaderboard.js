class Leaderboard {

  constructor() {

    console.log("constructor")
    var div
    this.div = createDiv()
    this.div.style('font-size', '25px')
    this.div.style('color','black')
    this.div.style('height',' 25%')
    this.div.style('width','13.2%')
    this.div.style('opacity',' 0.9')
    this.div.style('background','rgba(192, 192, 192, 0.4)')
    this.div.position('absolute')
    this.div.style('top', '0px')
    this.div.style('left', '85%')
    this.div.style('border-radius', '25px')
    this.div.style('padding', '20px')
    this.div.style('border-style','solid')


    this.leaderBoard_update_counter = 0

  }

  update(gameState) {
    console.log("started update")
    console.log(gameState)

    this.leaderBoard_update_counter = this.leaderBoard_update_counter + 1
    if (this.leaderBoard_update_counter >= 40){
        var players = gameState.playerlist
        console.log(players)
        players.sort(function (x, y) {
          return y.gold - x.gold
        })
      this.leaderBoard_update_counter = 0
      var table = ""
      for (var i = 0; i < players.length; i++ ) {
        if (i >= 5 ) {break}
        table = table + "<tr><td>" + players[i].gold + "</td><td>   </td><td>" +"   -    "+ players[i].username + "</td></tr>"
      }
      this.div.html("<style>th, td {padding: 10pxtext-align: left}</style><h2>Gold Leaderboard</h2><body><table>" + table + "</table></body>")

    }

  }

  delete(){
    this.div.remove()
  }

}
