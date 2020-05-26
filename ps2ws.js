const WebSocket   = require('ws');

const match = require('./match.js');

var subAttempt = 0;
var unsubAttempt = 0;

let ws = new WebSocket('wss://push.planetside2.com/streaming?environment=ps2&service-id=s:' + "pil");

ws.on('open', function open() {
  subAttempt += 1;
  console.log('Stream opened... [' + subAttempt + ']');
});

ws.on('message', function (data) {
  if (data.indexOf("payload") === 2) {
    match.dealWithTheData(data)
  }
});

ws.on('close', function (data) {
  console.log('Stream closed...');
  console.log(data);
  ws.close();
  ws = new WebSocket('wss://push.planetside2.com/streaming?environment=ps2&service-id=s:' + "pil");
});

const allXpIdsRevives = [
  7,      // Revive (75xp)
  53      // Squad Revive (100xp)
];

function addXpIdToXpGainString(xpID, xpGainString) {
  if (xpGainString === '' || xpGainString === null || xpGainString === undefined) {
    return makeXpIdString(xpID);
  }
  return xpGainString.concat(',',makeXpIdString(xpID));
}

function makeXpIdString(xpID) {
  return '"GainExperience_experience_id_' + xpID + '"';
}

function getExperienceIds(revives) {
  var xpGainString = '';
  if (revives === true) {
    for (xpIdx = 0; xpIdx < allXpIdsRevives.length; xpIdx++) {
      let xpID = allXpIdsRevives[xpIdx];
      xpGainString = addXpIdToXpGainString(xpID, xpGainString);
    }
  }
  return xpGainString;
}

function subscribe(ws) {
  var xpGainString = getExperienceIds(true);

  server_id = match.getServer();
  ws.send('{"service":"event","action":"subscribe","characters":["all"],"eventNames":["Death", "VehicleDestroy"],"worlds":["' + server_id +'"],"logicalAndCharactersWithWorlds":true}')
  ws.send('{"service":"event","action":"subscribe","characters":["all"],"eventNames":[' + xpGainString + '],"worlds":["' + server_id +'"],"logicalAndCharactersWithWorlds":true}')

  ws.send('{"service":"event","action":"subscribe","worlds":["' + server_id +'"],"eventNames":["FacilityControl"]}');
  console.log("Subscribe to server "+ server_id);
}

function unsubscribe(ws) {
  // unsubscribes from all events
  unsubAttempt += 1;
  try {
    ws.send('{"service":"event","action":"clearSubscribe","all":"true"}');
    console.log('Unsubscribed from facility and kill/death events');
  }
  catch(err) {
    console.log('Unsubscribe failed... [' + unsubAttempt + ']');
    console.log(err);
    if (socket.getRunning() === true && timeCounter === 0) {
      unsubscribe(ws);
    }
  }
}

function startTheMatch() {
  subscribe(ws);
}

function stopTheMatch() {
  unsubscribe(ws);
}

exports.startTheMatch = startTheMatch;
exports.stopTheMatch = stopTheMatch;
