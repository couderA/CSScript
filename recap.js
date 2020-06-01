var socket = io();
socket.emit('subscribe');


$(function(){
  let root = document.documentElement;

  var teamOneData = {}
  var teamTwoData = {}

  function buildProgressBar() {


    if (teamOneData.faction == 1) { //VS
      root.style.setProperty('--color-team1-light', "var(--color-vs-light)");
      root.style.setProperty('--color-team1-dark', "var(--color-vs-dark)");
    } else if (teamOneData.faction == 2) { // NC
      root.style.setProperty('--color-team1-light', "var(--color-nc-light)");
      root.style.setProperty('--color-team1-dark', "var(--color-nc-dark)");
    } else if (teamOneData.faction == 3) { // TR
      root.style.setProperty('--color-team1-light', "var(--color-tr-light)");
      root.style.setProperty('--color-team1-dark', "var(--color-tr-dark)");
    }

    if (teamTwoData.faction == 1) { //VS
      root.style.setProperty('--color-team2-light', "var(--color-vs-light)");
      root.style.setProperty('--color-team2-dark', "var(--color-vs-dark)");
    } else if (teamTwoData.faction == 2) { // NC
      root.style.setProperty('--color-team2-light', "var(--color-nc-light)");
      root.style.setProperty('--color-team2-dark', "var(--color-nc-dark)");
    } else if (teamTwoData.faction == 3) { // TR
      root.style.setProperty('--color-team2-light', "var(--color-tr-light)");
      root.style.setProperty('--color-team2-dark', "var(--color-tr-dark)");
    }

    class_names = ["kills", "deaths", "revives", "maxRevive", "nanitesLost", "vehicleKilled", "vehicleLost"]

    for (var i in class_names) {
      var displayer = class_names[i]
      team1Number = teamOneData[displayer]
      overall = teamTwoData[displayer] + team1Number
      var percent = (team1Number / overall) * 100
      if (isNaN(percent)) {
        percent = 50
      } else {
        percent = percent.toFixed(2)
      }

      $("#"+ displayer + " .team1").html(teamOneData[displayer])
      $("#"+ displayer + " .team2").html(teamTwoData[displayer])
      root.style.setProperty("--percent-" + displayer, percent + "%");
    }
  }

  socket.on('teamsUpdate',function(data) {
    teamOneData = data.teamOne
    teamTwoData = data.teamTwo
    buildProgressBar()
  });
});
