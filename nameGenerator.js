module.exports = {
  name: function () {
    const rank = [
      "",
      "Pirate",
      "Captain",
      "Cap'n",
      "Admiral",
      "First Mate",
      "Gunner",
      "Powder Monkey",
      "Boatswain",
      "Old",
      "Sailor",
      "Lt",
      "Lord",
      "Little",
      "Big",
      "Jolly",
      "Great",
      "Crewmate",
    ];

    const firstName = [
      "Pirate",
      "Grape",
      "Black",
      "Red",
      "o'",
      "Wet",
      "Sea",
      "Mitchell",
      "Arkie",
      "Sean",
      "Prem",
      "Davey",
      "Jack",
      "Peeko",
      "Grim",
      "Skull",
      "Scurvy",
      "Roger",
      "Crab",
      "Spike",
      "Dagger",
    ]
    const lastName = [
      "",
      " Pirate",
      "-Beard",
      " ol'Dog",
      "-Leg",
      "-Foot",
      "-Eye",
      "-Face",
      " the Great",
      " of the Sea",
      " McPirate",
      " Knives",
      " Sparrow",

    ]

    var selectedRank = rank[Math.floor(Math.random() * rank.length)]
    var selectedFirstName = firstName[Math.floor(Math.random() * firstName.length)]
    var selectedLastName = lastName[Math.floor(Math.random() * lastName.length)]

    return selectedRank + " " + selectedFirstName + selectedLastName
  }
}
