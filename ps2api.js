// http://census.daybreakgames.com/get/ps2:v2/map/?world_id=1&zone_ids=2

const app = require('./app.js'),
http = require('http'),
match = require('./match.js');

function initializeMap(data) {
  var mapObj = data[0]
  if (mapObj != undefined && mapObj.ZoneId == match.getContinent()) {
    var regions = mapObj.Regions.Row;
    factionCountBase = [0,0,0,0,0];
    if (regions != undefined) {
      for (var i in regions) {
        var region = regions[i].RowData;
        if (region != undefined) {
          factionindex = region.FactionId;
          factionCountBase[factionindex] = factionCountBase[factionindex] + 1;
        }
      }
      match.initializeScore(factionCountBase);
    }
  }
}

function getMap() {
  var server_id = match.getServer()
  var continent_id = match.getContinent()
  var url = "http://census.daybreakgames.com/get/ps2:v2/map/?world_id="+server_id+"&zone_ids="+continent_id
  console.log(url)
  http.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
    }
    if (error) {
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        if (parsedData.map_list != undefined) {
          initializeMap(parsedData.map_list)
        }
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

function paseBaseData(data) {
  var baseObj = data[0]
  if (baseObj != undefined && baseObj.zone_id == match.getContinent()) {
    facility_name = baseObj.facility_name
    if (parseInt(baseObj.facility_type_id) in [2,3,4]) {
      facility_name = baseObj.facility_name
      facility_name = facility_name + " " + baseObj.facility_type
    }
    return facility_name
  }
  return ""
}

function getBaseName(facility_id, team_id) {
  var url = "http://census.daybreakgames.com/get/ps2:v2/map_region/?facility_id="+facility_id
  console.log(url)
  http.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
    }
    if (error) {
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        if (parsedData.map_region_list != undefined) {
          name = paseBaseData(parsedData.map_region_list)
          match.sendCapNotification(name, team_id)
        }
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

exports.getMap = getMap;
exports.getBaseName = getBaseName;
exports.initializeMap = initializeMap;
