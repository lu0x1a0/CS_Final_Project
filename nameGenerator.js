module.exports = {
  name: function () {
    const rank = [
      "",
      "Pirate",
      "Captain",
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
    ];

    const firstName = [
      "Pirate",
      "Grape",
      "Black",
      "Red",
      "o'",
      "Wet",
      "Mitchell",
      "Arkie",
      "Sean",
      "Prem",
    ]
    const lastName = [
      "",
      " Pirate",
      "-Beard",
      " ol'Dog",
      "-Leg",
      "-Foot",
      "-Eye",
      " the Great",
    ]

    var selectedRank = rank[Math.floor(Math.random() * rank.length)]
    var selectedFirstName = firstName[Math.floor(Math.random() * firstName.length)]
    var selectedLastName = lastName[Math.floor(Math.random() * lastName.length)]

    return selectedRank + " " + selectedFirstName + selectedLastName
  }
}
