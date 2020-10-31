const app     = require('./app.js'),
      Stats   = require('./stats.js'),
      vehicles = require('./vehicles.js');

let t1 = {
  id:1,
  fc : '',
  name : '',
  faction : 0,
  score: 0,
  kills : 0,
  deaths : 0,
  teamKills: 0,
  suicides: 0,
  revives: 0,
  nanitesLost: 0,
  maxRevive: 0,
  vehicleKilled: 0, // enemy vehicle killed
  vehicleLost: 0,  // ally vehicle killed
  infantryStats: [],
  vehicleStats: [],
  maxPlayerIds: []
}

let t2 = {
  id:2,
  fc : '',
  name : '',
  faction : 0,
  score: 0,
  kills : 0,
  deaths : 0,
  teamKills: 0,
  suicides: 0,
  revives: 0,
  nanitesLost: 0,
  maxRevive: 0,
  vehicleKilled: 0, // enemy vehicle killed
  vehicleLost: 0,  // ally vehicle killed
  infantryStats: [],
  vehicleStats: [],
  maxPlayerIds: []
}

function getT1() { return t1; }

function getT2() { return t2; }

function resetScore() {
  t1.score = 0
  t1.kills = 0
  t1.deaths = 0
  t1.teamKills = 0
  t1.suicides = 0
  t1.revives = 0
  t1.nanitesLost = 0
  t1.maxRevive = 0
  t1.vehicleKilled = 0
  t1.vehicleLost = 0
  t1.infantryStats = []
  t1.vehicleStats = []
  t1.maxPlayerIds = []

  t2.score = 0
  t2.kills = 0
  t2.deaths = 0
  t2.teamKills = 0
  t2.suicides = 0
  t2.revives = 0
  t2.nanitesLost = 0
  t2.maxRevive = 0
  t2.vehicleKilled = 0
  t2.vehicleLost = 0
  t2.infantryStats = []
  t2.vehicleStats = []
  t2.maxPlayerIds = []

  teamsUpdate();
}


function addMaxPlayerId(teamId, player_id) {
  if (teamId == 1) {
    if (t1.maxPlayerIds.indexOf(player_id) == -1) {
      t1.maxPlayerIds.push(player_id)
    }
  } else {
    if (t2.maxPlayerIds.indexOf(player_id) == -1) {
      t2.maxPlayerIds.push(player_id)
    }
  }
}

function wasPlayerMax (teamId, player_id) {
  if (teamId == 1) {
    if (t1.maxPlayerIds.indexOf(player_id) != -1) {
      t1.maxPlayerIds.splice(t1.maxPlayerIds.indexOf(player_id), 1)
    }
  } else {
    if (t2.maxPlayerIds.indexOf(player_id) != -1) {
      t2.maxPlayerIds.splice(t2.maxPlayerIds.indexOf(player_id), 1)
    }
  }
}

function wasRevivedPlayerMax(teamId, player_id) {
  if (teamId == 1) {
    if (t1.maxPlayerIds.indexOf(player_id) != -1) {
      t1.maxPlayerIds.splice(t1.maxPlayerIds.indexOf(player_id), 1)
      return true
    }
  } else {
    if (t2.maxPlayerIds.indexOf(player_id) != -1) {
      t2.maxPlayerIds.splice(t2.maxPlayerIds.indexOf(player_id), 1)
      return true
    }
  }
  return false
}

function setInfantryStats(teamId, class_slug, stats) {
  var found = false
  if (teamId == 1) {
    for (let i = 0; i < t1.infantryStats.length; i++) {
      if (t1.infantryStats[i].class == class_slug) {
        found = true
        t1.infantryStats[i].incrementStats(stats)
        break;
      }
    }
    if (found == false) {
      var stat = new Stats(class_slug)
      stat.incrementStats(stats)
      t1.infantryStats.push(stat)
    }
  } else {
    for (let i = 0; i < t2.infantryStats.length; i++) {
      if (t2.infantryStats[i].class == class_slug) {
        found = true
        t2.infantryStats[i].incrementStats(stats)
        break;
      }
    }
    if (found == false) {
      var stat = new Stats(class_slug)
      stat.incrementStats(stats)
      t2.infantryStats.push(stat)
    }
  }
}

function setVehicleStats(teamId, vehicle_slug, stats) {
  var found = false
  if (teamId == 1) {
    for (let i = 0; i < t1.vehicleStats.length; i++) {
      if (t1.vehicleStats[i].class == vehicle_slug) {
        found = true
        t1.vehicleStats[i].incrementStats(stats)
        break;
      }
    }
    if (found == false) {
      var stat = new Stats(vehicle_slug)
      stat.incrementStats(stats)
      t1.vehicleStats.push(stat)
    }
  } else {
    for (let i = 0; i < t2.vehicleStats.length; i++) {
      if (t2.vehicleStats[i].class == vehicle_slug) {
        found = true
        t2.vehicleStats[i].incrementStats(stats)
        break;
      }
    }
    if (found == false) {
      var stat = new Stats(vehicle_slug)
      stat.incrementStats(stats)
      t2.vehicleStats.push(stat)
    }
  }
}

function setProperty(teamId, property, value) {
  if (teamId == 1) {
    t1[property] = value
  } else {
    t2[property] = value
  }
}

function addTeamKill(teamId, class_slug) {
  setInfantryStats(teamId, class_slug, "death")
  let cost = 0
  if (class_slug == "max") {
    cost = 450
  }
  if (teamId == 1) {
    setProperty(teamId, "teamKills", t1.teamKills + 1)
    setProperty(teamId, "deaths", t1.deaths + 1)
    setProperty(teamId, "nanitesLost", t1.nanitesLost + cost)
  } else {
    setProperty(teamId, "teamKills", t2.teamKills + 1)
    setProperty(teamId, "deaths", t2.deaths + 1)
    setProperty(teamId, "nanitesLost", t2.nanitesLost + cost)
  }
  teamsUpdate();
}
function addKill(teamId, class_slug) {
  setInfantryStats(teamId, class_slug, "kill")
  if (teamId == 1) {
    setProperty(teamId, "kills", t1.kills + 1)
  } else {
    setProperty(teamId, "kills", t2.kills + 1)
  }
  teamsUpdate();
}
function addDeath(teamId, class_slug) {
  setInfantryStats(teamId, class_slug, "death")
  let cost = 0
  if (class_slug == "max") {
    cost = 450
  }
  if (teamId == 1) {
    setProperty(teamId, "deaths", t1.deaths + 1)
    setProperty(teamId, "nanitesLost", t1.nanitesLost + cost)
  } else {
    setProperty(teamId, "deaths", t2.deaths + 1)
    setProperty(teamId, "nanitesLost", t2.nanitesLost + cost)
  }
  teamsUpdate();
}

function addMaxRevive(teamId) {
  if (teamId == 1) {
    setProperty(teamId, "maxRevive", t1.maxRevive + 1)
    setProperty(teamId, "nanitesLost", t1.nanitesLost - 450)
  } else {
    setProperty(teamId, "maxRevive", t2.maxRevive + 1)
    setProperty(teamId, "nanitesLost", t2.nanitesLost - 450)
  }
  teamsUpdate();
}

function addRevive(teamId) {
  if (teamId == 1) {
    setProperty(teamId, "revives", t1.revives + 1)
  } else {
    setProperty(teamId, "revives", t2.revives + 1)
  }
  teamsUpdate();
}

function addKillAsVehicle(teamId, vehicle_slug, class_slug) {
  setInfantryStats(teamId, class_slug, "kill")
  setVehicleStats(teamId, vehicle_slug, "kill")
  if (teamId == 1) {
    setProperty(teamId, "kills", t1.kills + 1)
  } else {
    setProperty(teamId, "kills", t2.kills + 1)
  }
  teamsUpdate();
}

function addSuicide(teamId, class_slug) {
  setInfantryStats(teamId, class_slug, "death")
  let cost = 0
  if (class_slug == "max") {
    cost = 450
  }
  if (teamId == 1) {
    setProperty(teamId, "suicides", t1.suicides + 1)
    setProperty(teamId, "deaths", t1.deaths + 1)
    setProperty(teamId, "nanitesLost", t1.nanitesLost + cost)
  } else {
    setProperty(teamId, "suicides", t2.suicides + 1)
    setProperty(teamId, "deaths", t2.deaths + 1)
    setProperty(teamId, "nanitesLost", t2.nanitesLost + cost)
  }
  teamsUpdate();
}

function addVehicleKilled(teamId, vehicle) {
  setVehicleStats(teamId, vehicle, "destroyed")
  if (teamId == 1) {
    setProperty(teamId, "vehicleKilled", t1.vehicleKilled + 1)
  } else {
    setProperty(teamId, "vehicleKilled", t2.vehicleKilled + 1)
  }
  teamsUpdate();
}

function addVehicleLost(teamId, vehicle) {
  setVehicleStats(teamId, vehicle, "lost")
  cost = vehicles.getCost(vehicle)
  if (teamId == 1) {
    setProperty(teamId, "vehicleLost", t1.vehicleLost + 1)
    setProperty(teamId, "nanitesLost", t1.nanitesLost + cost)
  } else {
    setProperty(teamId, "vehicleLost", t2.vehicleLost + 1)
    setProperty(teamId, "nanitesLost", t2.nanitesLost + cost)
  }
  teamsUpdate();
}

function teamsUpdate() {
    app.send('teamsUpdate', { teamOne: t1, teamTwo: t2 });
}

function getTeamFromFaction(factionId) {
  if (factionId ==  t1.faction) {return t1}
  if (factionId ==  t2.faction) {return t2}
  return undefined
}

exports.getT1       = getT1;
exports.getT2       = getT2;
exports.resetScore  = resetScore;
exports.setProperty = setProperty
exports.getTeamFromFaction = getTeamFromFaction
exports.addTeamKill = addTeamKill
exports.addKill = addKill
exports.addDeath = addDeath
exports.addSuicide = addSuicide
exports.addVehicleKilled = addVehicleKilled
exports.addVehicleLost = addVehicleLost
exports.addKillAsVehicle = addKillAsVehicle
exports.teamsUpdate =  teamsUpdate
exports.addRevive = addRevive
exports.addMaxPlayerId = addMaxPlayerId
exports.wasPlayerMax = wasPlayerMax
exports.wasRevivedPlayerMax = wasRevivedPlayerMax
exports.addMaxRevive = addMaxRevive
