module.exports = {
  name: function () {
    const rank = [
      "Pirate",
      "Captain",
      "First Mate",
      "Gunner",
      "Powder Monkey",
      "Boatswain",
      "Old",
      "Sailor",
    ];

    const firstName = [
      "Pirate",
      "Grape",
      "Black",
      "Red",
      "o'",
    ]
    const lastName = [
      "Pirate",
      "",
      "Beard",
      "olDog",
      "Leg",
      "Foot",
      "Eye",
    ]

    var selectedRank = rank[Math.floor(Math.random() * rank.length)]
    var selectedFirstName = firstName[Math.floor(Math.random() * firstName.length)]
    var selectedLastName = lastName[Math.floor(Math.random() * lastName.length)]

    return selectedRank + " " + selectedFirstName + selectedLastName
  }
}
