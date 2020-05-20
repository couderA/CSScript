const app = require("./app.js"),
      match = require("./match.js"),
      team = require("./team.js");

let t1 = {
  killData: [],
  captureData: []
}

let t2 = {
  killData: [],
  captureData: []
}

let interval = undefined

function addKillData(time, value_team_1, value_team_2) {
  t1.killData.push({x:time, y:value_team_1})
  t2.killData.push({x:time, y:value_team_2})
}

function addCaptureData(time, value_team_1, value_team_2) {
  t1.captureData.push({x:time, y:value_team_1})
  t2.captureData.push({x:time, y:value_team_2})
}


function sendData() {
  return {t1:t1, t2:t2}
}

function resetData() {
  t1 = {
    killData: [],
    captureData: []
  }
  t2 = {
    killData: [],
    captureData: []
  }
}

function startRecordingKillData() {
  interval = setInterval(function(){
    time = match.getTime()
    let team1 = team.getT1()
    let team2 = team.getT2()
    addKillData(time, team1.kills, team2.kills)
  }, 30000);
}

function stopRecordingKillData() {
  if (interval != undefined) {
    clearInterval(interval);
  }
}

exports.addKillData = addKillData;
exports.addCaptureData = addCaptureData;
exports.sendData = sendData;
exports.resetData = resetData;
exports.startRecordingKillData = startRecordingKillData;
exports.stopRecordingKillData = stopRecordingKillData;
