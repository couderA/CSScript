const app = require('./app.js'),
Timer = require('./timer.js'),
team = require('./team.js'),
loadouts = require('./loadouts.js'),
vehicles = require('./vehicles.js'),
ps2ws = require('./ps2ws.js'),
ps2api = require('./ps2api.js'),
graphs = require('./graphs.js');

let caster1 = ""
let caster2 = ""

const timer = new Timer()

let progressBar = {
  id:"",
  name:"",
  visible:false,
}

function getTimer() {
  return timer
}

let factionCountBase = [0, 0, 0, 0, 0]
let numberOfbases = 1

let server_id = 19
let continent_id = 0

let statsDisplayed = "None" // VehG || VehA || Inf || None

function setTimer(minutes) {
  timer.setMinutes(minutes)
}

function setCaster1(value) {
  caster1 = value
}

function setCaster2(value) {
  caster2 = value
}

function setStatsDisplayed(value) {
  statsDisplayed = value
}

function setProgressBar(data) {
  progressBar = data
}

function getProgressBar(data) {
  return progressBar
}

function setServer(id) {
  server_id = id
}

function getServer() {
  return server_id
}

function setContinent(id) {
  continent_id = id
}

function getContinent(id) {
  return continent_id
}

function initializeMatch() {
  ps2api.getMap()
  team.teamsUpdate()
  refresh()
  graphs.resetData()
}

function getTime() {
  time = timer.getTime()
  return time
}

function start() {
  timer.startTimer()
  ps2ws.startTheMatch()
  time = timer.getTime()
  let t1 = team.getT1()
  let t2 = team.getT2()
  graphs.addKillData(time, t1.kills, t2.kills)
  let scoreT1 = Math.round((factionCountBase[t1.faction] / numberOfbases) * 100)
  let scoreT2 = Math.round((factionCountBase[t2.faction] / numberOfbases) * 100)
  graphs.addCaptureData(time, scoreT1, scoreT2)
  graphs.startRecordingKillData()
}

function stop() {
  timer.stopTimer()
  ps2ws.stopTheMatch()
  time = timer.getTime()
  let t1 = team.getT1()
  let t2 = team.getT2()
  graphs.addKillData(time, t1.kills, t2.kills)
  let scoreT1 = Math.round((factionCountBase[t1.faction] / numberOfbases) * 100)
  let scoreT2 = Math.round((factionCountBase[t2.faction] / numberOfbases) * 100)
  graphs.addCaptureData(time, scoreT1, scoreT2)
  graphs.stopRecordingKillData()
}


function matchEnded() {
  ps2ws.stopTheMatch()
  time = timer.getTime()
  let t1 = team.getT1()
  let t2 = team.getT2()
  graphs.addKillData(time, t1.kills, t2.kills)
  let scoreT1 = Math.round((factionCountBase[t1.faction] / numberOfbases) * 100)
  let scoreT2 = Math.round((factionCountBase[t2.faction] / numberOfbases) * 100)
  graphs.addCaptureData(time, scoreT1, scoreT2)
  graphs.stopRecordingKillData()
}

function reset() {
  timer.resetTimer()
  team.resetScore()
  graphs.stopRecordingKillData()
  graphs.resetData()
}

function refresh() {
  app.send('refresh', {
    caster1: caster1,
    caster2: caster2,
    progressBar:progressBar,
    statsDisplayed:statsDisplayed
  });
  timer.sendTimerInfo()
}

function computeScore() {
  let t1 = team.getT1()
  let t2 = team.getT2()
  let scoreT1 = Math.round((factionCountBase[t1.faction] / numberOfbases) * 100)
  let scoreT2 = Math.round((factionCountBase[t2.faction] / numberOfbases) * 100)
  team.setProperty(t1.id, "score", scoreT1)
  team.setProperty(t2.id, "score", scoreT2)
  team.teamsUpdate()
}

function initializeScore(factionCountBaseArray) {
  factionCountBase = factionCountBaseArray
  numberOfbases = factionCountBase.reduce((a, b) => a + b, 0)
  computeScore()
}

function itsDeathData(data) {
  factionAttacker = loadouts.getFactionForLoadout(data.attacker_loadout_id)
  classAttacker = loadouts.getClassForLoadout(data.attacker_loadout_id)
  vehicleAttacker = vehicles.getVehicleForLoadout(data.attacker_vehicle_id)
  teamAttack = team.getTeamFromFaction(factionAttacker)
  if (teamAttack != undefined){
    if (data.attacker_character_id == data.character_id) { // suicide
      team.addSuicide(teamAttack.id, classAttacker)
      if (classAttacker == "max") {
        team.addMaxPlayerId(teamAttack.id, data.attacker_character_id)
      } else {
        team.wasPlayerMax(teamAttack.id, data.attacker_character_id)
      }
    } else {
      factionVictim = loadouts.getFactionForLoadout(data.character_loadout_id)
      classVictim = loadouts.getClassForLoadout(data.character_loadout_id)
      teamVictim = team.getTeamFromFaction(factionVictim)
      if (classVictim == "max" && teamVictim != undefined) {
        team.addMaxPlayerId(teamVictim.id, data.character_id)
      } else if (teamVictim != undefined) {
        team.wasPlayerMax(teamAttack.id, data.character_id)
      }
      if (factionAttacker == factionVictim) { // teamkill
        team.addTeamKill(teamAttack.id, classVictim)
      } else if (teamVictim != undefined) {
        if ((vehicleAttacker == "flash") ||
        (vehicleAttacker == "sunderer") ||
        (vehicleAttacker == "lightning") ||
        (vehicleAttacker == "liberator") ||
        (vehicleAttacker == "galaxy") ||
        (vehicleAttacker == "harasser") ||
        (vehicleAttacker == "valkyrie") ||
        ((vehicleAttacker == "magrider" || vehicleAttacker == "scythe") &&  factionAttacker == 1)  ||
        ((vehicleAttacker == "vanguard" || vehicleAttacker == "reaver") &&  factionAttacker == 2) ||
        ((vehicleAttacker == "prowler" || vehicleAttacker == "mosquito") &&  factionAttacker == 3)) {
          team.addKillAsVehicle(teamAttack.id, vehicleAttacker, classAttacker)
        } else {
          team.addKill(teamAttack.id, classAttacker)
        }
        team.addDeath(teamVictim.id, classVictim)
      }
    }
  }
}

function itsVehicleDestroyData(data) {
  var factionAttacker = loadouts.getFactionForLoadout(data.attacker_loadout_id)
  var vehicleAttacker = vehicles.getVehicleForLoadout(data.attacker_vehicle_id)
  var teamAttack = team.getTeamFromFaction(factionAttacker)
  if (teamAttack != undefined){
    if (data.attacker_character_id == data.character_id) { // own vehicle destroyed
      vehicleAttacker = vehicles.getVehicleForLoadout(data.vehicle_id)
      team.addVehicleLost(teamAttack.id, vehicleAttacker)
    } else {
      factionVictim = data.faction_id
      vehicleVictim = vehicles.getVehicleForLoadout(data.vehicle_id)
      teamVictim = team.getTeamFromFaction(factionVictim)
      if (vehicleVictim != "unknwon"){
        if (factionAttacker == factionVictim) {  // ally vehicle destroyed
          team.addVehicleLost(teamAttack.id, vehicleVictim)
        } else if (teamVictim != undefined){ // ennemy vehicle killed
          if (vehicleAttacker != "unknwon") {
            team.addVehicleKilled(teamAttack.id, vehicleAttacker)
          }
          team.addVehicleLost(teamVictim.id, vehicleVictim)
        }
      }
    }
  }
}

function itsExperienceData(data) {
  factionMedic = loadouts.getFactionForLoadout(data.loadout_id)
  teamMedic = team.getTeamFromFaction(factionMedic)
  if (teamMedic != undefined) {
    team.addRevive(teamMedic.id)
    if (team.wasRevivedPlayerMax(teamMedic.id, data.other_id)) {
      team.addMaxRevive(teamMedic.id)
    }
  }
}


function itsFacilityData(data) {
  cappingTeam = team.getTeamFromFaction(data.new_faction_id)
  if (cappingTeam != undefined && data.new_faction_id != data.old_faction_id) {
    newFactionIndex = parseInt(data.new_faction_id)
    oldFactionIndex = parseInt(data.old_faction_id)
    factionCountBase[newFactionIndex] = factionCountBase[newFactionIndex] + 1
    factionCountBase[oldFactionIndex] = factionCountBase[oldFactionIndex] - 1
    computeScore();
    let t1 = team.getT1()
    let t2 = team.getT2()
    let scoreT1 = Math.round((factionCountBase[t1.faction] / numberOfbases) * 100)
    let scoreT2 = Math.round((factionCountBase[t2.faction] / numberOfbases) * 100)
    graphs.addCaptureData(time, scoreT1, scoreT2)
    ps2api.getBaseName(data.facility_id, cappingTeam.id)
  }
}

function sendCapNotification(name, team_id) {
  app.send("notifBaseCap", {
    team_id:team_id,
    name: name
  })
}

function sendRecapData() {
  app.send("recapData", {
    t1:team.getT1(),
    t2:team.getT2(),
    data: graphs.sendData()
  })
}

function dealWithTheData(raw) {
  raw = raw.replace(': :', ':');
  const data = JSON.parse(raw).payload;
  if (parseInt(data.zone_id) == continent_id) {
    switch(data.event_name) {
      case "Death":
      itsDeathData(data);
      break;
      case "VehicleDestroy":
      itsVehicleDestroyData(data);
      break;
      case "FacilityControl":
      itsFacilityData(data);
      break;
      case "GainExperience":
      itsExperienceData(data);
      break;
      default:
      return;
    }
  }
}

exports.dealWithTheData = dealWithTheData;
exports.start = start;
exports.stop = stop;
exports.reset = reset;
exports.refresh = refresh;
exports.setCaster1 = setCaster1;
exports.setCaster2 = setCaster2;
exports.setStatsDisplayed = setStatsDisplayed;
exports.setProgressBar = setProgressBar;
exports.getProgressBar = getProgressBar;
exports.getServer = getServer;
exports.setServer = setServer;
exports.setTimer = setTimer;
exports.setContinent = setContinent;
exports.getContinent = getContinent;
exports.initializeMatch = initializeMatch;
exports.initializeScore = initializeScore;
exports.sendCapNotification = sendCapNotification;
exports.matchEnded = matchEnded;
exports.getTime = getTime;
exports.sendRecapData = sendRecapData;
