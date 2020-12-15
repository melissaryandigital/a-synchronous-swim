var moves = ['up', 'down', 'left', 'right'];

var swim = {
  random: function (){
    var randomIndex = Math.floor(Math.random() * 4);
    var randomDirection = moves[randomIndex];
    return randomDirection;
  }
}

module.exports = swim;
