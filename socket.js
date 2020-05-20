const app = require('./app.js'),
      team = require('./team.js'),
      match = require('./match.js');


module.exports = {
    init: function(io) {
      io.on('connection', function(socket){
        socket.on('subscribe', function(data) {
          if (data && data.recap) {
            match.sendRecapData()
          } else {
            match.refresh()
            team.teamsUpdate()
          }
        });
        socket.on('initializeMatch', function(data) {
          match.setServer(data.server)
          match.setContinent(data.continent)
          match.setCaster1(data.caster1)
          match.setCaster2(data.caster2)
          match.setTimer(data.minutes)
          team.setProperty(1, "name",  data.team1)
          team.setProperty(2, "name",  data.team2)
          team.setProperty(1, "faction",  data.factionTeam1)
          team.setProperty(2, "faction",  data.factionTeam2)
          match.initializeMatch()
        });
        socket.on('progressBarChanged', function(data) {
          var progressBar = match.getProgressBar()
          if (data.displayer == "None") {
            progressBar.visible = false
          } else {
            progressBar.visible = true
            progressBar.id = data.displayer
            progressBar.name = data.verboseName
          }
          match.setProgressBar(progressBar)
          match.refresh()
        });
        socket.on('statsChanged', function(data) {
          match.setStatsDisplayed(data.displayer)
          match.refresh()
        });
        socket.on('Start', function() {
          match.start()
        });
        socket.on('Stop', function() {
          match.stop()
        });
        socket.on('Reset', function() {
          match.reset()
        });
      });
      function send(name, obj) {
          io.emit(name, obj);
      };
    },
    sendData : function (name, obj, io) {
      io.emit(name, obj);
    },
};
