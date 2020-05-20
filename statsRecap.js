var socket = io();
socket.emit('subscribe');


$(function(){

  var teamOneData = {}
  var teamTwoData = {}

  function buildArrayVehG(team, data, reverse) {
    var class_identifier = ["flash", "harasser", "sunderer", "lightning", "magrider", "vanguard", "prowler", "ant"]
    var image_name = ["Icon_Flash","Icon_Harasser","Icon_Sunderer", "Icon_Lightning", "Icon_Magrider", "Icon_Vanguard", "Icon_Prowler", "Icon_Ant"]

    if (reverse) {
      class_identifier=class_identifier.reverse()
      image_name=image_name.reverse()
    }

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

  function buildArrayVehA(team, data, reverse) {
    var class_identifier = ["reaver", "scythe", "mosquito", "valkyrie", "liberator", "galaxy"]
    var image_name = ["Icon_Reaver","Icon_Scythe","Icon_Mosquito", "Icon_Valkyrie", "Icon_Liberator", "Icon_Galaxy"]

    if (reverse) {
      class_identifier=class_identifier.reverse()
      image_name=image_name.reverse()
    }

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

  function buildArrayVehInf(team, data, reverse) {
    var class_identifier = ["heavy", "medic", "infil", "la", "engy", "max"]
    var image_name = ["heavy", "medic", "infil", "light", "engi", "max"]

    if (reverse) {
      class_identifier=class_identifier.reverse()
      image_name=image_name.reverse()
    }

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


  socket.on('teamsUpdate',function(data) {

    teamOneData = data.teamOne
    teamTwoData = data.teamTwo


    $("#team1").html(teamOneData.name)
    $("#team2").html(teamTwoData.name)

    buildArrayVehG("team1", teamOneData.vehicleStats);
    buildArrayVehA("team1", teamOneData.vehicleStats);
    buildArrayVehInf("team1", teamOneData.infantryStats);
    buildArrayVehG("team2", teamTwoData.vehicleStats, true);
    buildArrayVehA("team2", teamTwoData.vehicleStats, true);
    buildArrayVehInf("team2", teamTwoData.infantryStats, true);
  });
});
