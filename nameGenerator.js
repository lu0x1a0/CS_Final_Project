module.exports = {
  name: function () {
    const rank = ["Captain",
                  "FirstMate",
                  "Gunner",
                  "Powder Monkey",
                  "Boatswain"];

    const firstName = [ "Grape",
                        "Black"

    ]
    const lastName = [ "Beard",
                        "olDog"
    ]

    var selectedRank = rank[Math.floor(Math.random() * rank.length)]
    var selectedFirstName = firstName[Math.floor(Math.random() * firstName.length)]
    var selectedLastName = lastName[Math.floor(Math.random() * lastName.length)]

    return selectedRank + " " + selectedFirstName + selectedLastName
  }
}
