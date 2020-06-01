var socket = io();
socket.emit('subscribe');


$(function(){

  let root = document.documentElement;

  var displayer = "kills"
  var isProgressBarVisible = false

  var teamOneData = {}
  var teamTwoData = {}

  var statsDisplayed = ""

  function buildArrayVehG(team, data) {
    var class_identifier = ["flash", "harasser", "sunderer", "lightning", "magrider", "vanguard", "prowler", "ant"]
    var image_name = ["Icon_Flash","Icon_Harasser","Icon_Sunderer", "Icon_Lightning", "Icon_Magrider", "Icon_Vanguard", "Icon_Prowler", "Icon_Ant"]

    $("." + team + " > #IconVehG > div.col").remove()
    $("." + team + " > #KillVehG > div.col").remove()
    $("." + team + " > #DestroyedVehG > div.col").remove()
    $("." + team + " > #LostVehG > div.col").remove()
    for (var i = 0 ; i < class_identifier.length; i++ ) {
      for (var y = 0; y < data.length; y++) {
        if (data[y].class == class_identifier[i]) {
          var divIcon = $('<div class="col centered">');
          var img  = $('<img src="PNG/' + image_name[i] + '.png" height="32">');
          var divKill = $('<div class="col centered">');
          divKill.html(data[y].killsAs)
          var divDestroyed = $('<div class="col centered">');
          divDestroyed.html(data[y].destroyedAs)
          var divLost = $('<div class="col centered">');
          divLost.html(data[y].lostAs)
          $(divIcon).append(img);
          $("." + team + " > #IconVehG").append(divIcon);
          $("." + team + " > #KillVehG").append(divKill);
          $("." + team + " > #DestroyedVehG").append(divDestroyed);
          $("." + team + " > #LostVehG").append(divLost);
          break
        }
      }
    }
  }

  function buildArrayVehA(team, data) {
    var class_identifier = ["reaver", "scythe", "mosquito", "valkyrie", "liberator", "galaxy"]
    var image_name = ["Icon_Reaver","Icon_Scythe","Icon_Mosquito", "Icon_Valkyrie", "Icon_Liberator", "Icon_Galaxy"]

    $("." + team + " > #IconVehA > div.col").remove()
    $("." + team + " > #KillVehA > div.col").remove()
    $("." + team + " > #DestroyedVehA > div.col").remove()
    $("." + team + " > #LostVehA > div.col").remove()
    for (var i = 0 ; i < class_identifier.length; i++ ) {
      for (var y = 0; y < data.length; y++) {
        if (data[y].class == class_identifier[i]) {
          var divIcon = $('<div class="col centered">');
          var img  = $('<img src="PNG/' + image_name[i] + '.png" height="32">');
          var divKill = $('<div class="col centered">');
          divKill.html(data[y].killsAs)
          var divDestroyed = $('<div class="col centered">');
          divDestroyed.html(data[y].destroyedAs)
          var divLost = $('<div class="col centered">');
          divLost.html(data[y].lostAs)
          $(divIcon).append(img);
          $("." + team + " > #IconVehA").append(divIcon);
          $("." + team + " > #KillVehA").append(divKill);
          $("." + team + " > #DestroyedVehA").append(divDestroyed);
          $("." + team + " > #LostVehA").append(divLost);
          break
        }
      }
    }
  }

  function buildArrayVehInf(team, data) {
    var class_identifier = ["heavy", "medic", "infil", "la", "engy", "max"]
    var image_name = ["heavy", "medic", "infil", "light", "engi", "max"]

    $("." + team + " > #IconInf > div.col").remove()
    $("." + team + " > #KillInf > div.col").remove()
    $("." + team + " > #DeathInf > div.col").remove()
    for (var i = 0 ; i < class_identifier.length; i++ ) {
      for (var y = 0; y < data.length; y++) {
        if (data[y].class == class_identifier[i]) {
          var divIcon = $('<div class="col centered">');
          var img  = $('<img src="PNG/' + image_name[i] + '.png" height="32">');
          var divKill = $('<div class="col centered">');
          divKill.html(data[y].killsAs)
          var divDeath = $('<div class="col centered">');
          divDeath.html(data[y].deathsAs)
          $(divIcon).append(img);
          $("." + team + " > #IconInf").append(divIcon);
          $("." + team + " > #KillInf").append(divKill);
          $("." + team + " > #DeathInf").append(divDeath);
          break
        }
      }
    }
  }

  function buildProgressBar() {
    team1Number = teamOneData[displayer]
    overall = teamTwoData[displayer] + team1Number

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

    percent = (team1Number / overall) * 100
    if (isNaN(percent)) {
      percent = 50
    } else {
      percent = percent.toFixed(2)
    }

    $("#valteam1").html(teamOneData[displayer])
    $("#valteam2").html(teamTwoData[displayer])

    root.style.setProperty('--percent', percent + "%");
  }

  socket.on('notifBaseCap', function(data) {
    var class_name = "team" + data.team_id
    $(".NotifContainer ."+ class_name).html(data.name + "Cap" )
    $(".NotifContainer ."+ class_name).removeClass("hidden")
    setTimeout(function(){
      $(".NotifContainer ."+ class_name).addClass("hidden")
    }, 5000);
  });

  socket.on('refresh',function(data) {
    console.log(data)
    if (data.caster1) {
      $("#caster1").html(data.caster1)
    }
    if (data.caster2) {
      $("#caster2").html(data.caster2)
    }
    if (data.progressBar) {
      $("#displayerTitle").html(data.progressBar.name)
      displayer = data.progressBar.id
      isProgressBarVisible = data.progressBar.visible
      if (isProgressBarVisible == true) {
        $(".ProgressBar").removeClass("hidden")
      } else {
        $(".ProgressBar").addClass("hidden")
      }
      buildProgressBar()
    }
    if (data.statsDisplayed) {
      if (data.statsDisplayed != statsDisplayed) {
        switch (data.statsDisplayed) {
          case "VehG":
            $(".VehA").addClass("hidden")
            $(".Inf").addClass("hidden")
            setTimeout(function(){$(".VehG").removeClass("hidden")},100);
          break;
          case "VehA":
              $(".VehG").addClass("hidden")
              $(".Inf").addClass("hidden")
              setTimeout(function(){$(".VehA").removeClass("hidden")},100);
          break;
          case "Inf":
              $(".VehG").addClass("hidden")
              $(".VehA").addClass("hidden")
              setTimeout(function(){$(".Inf").removeClass("hidden")},100);
          break;
          case "None":
              $(".VehG").addClass("hidden")
              $(".VehA").addClass("hidden")
              $(".Inf").addClass("hidden")
          break;
          default:
          break;
        }
        statsDisplayed = data.statsDisplayed
      }
    }
  });

  socket.on('timerInfo',function(data) {
    var minutes = data.minutes
    var seconds = data.seconds
    timerString = (minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds)
    $(".TimerContainer").html(timerString)
  });

  socket.on('teamsUpdate',function(data) {

    teamOneData = data.teamOne
    teamTwoData = data.teamTwo

    class_name = (teamOneData.faction == 1 ? "VS" : (teamOneData.faction == 2 ? "NC" : "TR"))
    class_name =  class_name + "-" + (teamTwoData.faction == 1 ? "VS" : (teamTwoData.faction == 2 ? "NC" : "TR"))


    if ($("#Background").hasClass(class_name) == false) {
      $("#Background").removeClass();
      $("#Background").addClass(class_name)
    }

    $(".ScoreContainer .team1 .name").html(teamOneData.name)
    $(".ScoreContainer .team2 .name").html(teamTwoData.name)

    $(".ScoreContainer .team1 .score").html(teamOneData.score)
    $(".ScoreContainer .team2 .score").html(teamTwoData.score)

    buildArrayVehG("team1", teamOneData.vehicleStats);
    buildArrayVehA("team1", teamOneData.vehicleStats);
    buildArrayVehInf("team1", teamOneData.infantryStats);
    buildArrayVehG("team2", teamTwoData.vehicleStats);
    buildArrayVehA("team2", teamTwoData.vehicleStats);
    buildArrayVehInf("team2", teamTwoData.infantryStats);
    buildProgressBar()
  });
});
