let vehicles = {
  1	: {"id":1, "name":"Flash", "class": "flash", "cost": 50},
  2	: {"id":2, "name":"Sunderer", "class": "sunderer", "cost": 200},
  3	: {"id":3, "name":"Lightning", "class": "lightning", "cost": 350},
  4	: {"id":4, "name":"Magrider", "class": "magrider", "cost": 450},
  5	: {"id":5, "name":"Vanguard", "class": "vanguard", "cost": 450},
  6	: {"id":6, "name":"Prowler", "class": "prowler", "cost": 450},
  7	: {"id":7, "name":"Scythe", "class": "scythe", "cost": 350},
  8	: {"id":8, "name":"Reaver", "class": "reaver", "cost": 350},
  9	: {"id":9, "name":"Mosquito", "class": "mosquito", "cost": 350},
  10 : {"id":10, "name":"Liberator", "class": "liberator", "cost": 450},
  11 : {"id":11, "name":"Galaxy", "class": "galaxy", "cost": 450},
  12 : {"id":12, "name":"Harasser", "class": "harasser", "cost": 150},
  14 : {"id":14, "name":"Valkyrie", "class": "valkyrie", "cost": 250},
  15 : {"id":15, "name":"ANT", "class": "ant", "cost": 200}
}

function getVehicle(id) {
    return vehicles[id]
}

function getVehicleForLoadout(id) {
  if (vehicles[id] != undefined) {
    return vehicles[id].class
  }
  return "unknwon"
}

function getCost(class_slug) {
  for (const key in vehicles) {
    if (vehicles[key].class == class_slug) {
      return vehicles[key].cost
    }
  }
  return 0
}

exports.getVehicle = getVehicle;
exports.getVehicleForLoadout = getVehicleForLoadout;
exports.getCost = getCost;
