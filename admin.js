var socket = io();
socket.emit('subscribe');

$(function(){
  $( "#matchInitializer" ).submit(function( event ) {
    server = parseInt($("#selectServer").val())
    continent = parseInt($("#selectContinent").val())
    caster1 = $("#caster1").val().toUpperCase()
    caster2 = $("#caster2").val().toUpperCase()
    team1 = $("#team1").val().toUpperCase()
    team2 = $("#team2").val().toUpperCase()
    factionTeam1 = parseInt($("#selectFactionTeam1").val())
    factionTeam2 = parseInt($("#selectFactionTeam2").val())
    minutes = $("#matchLength").val()
    if (caster1 != "" && caster2 != "" && factionTeam1 != factionTeam2 && team1 != "" && team2 != "") {
      $( ".buttonsDiv").removeClass("d-none")
      socket.emit('initializeMatch', {
        server : server,
        continent : continent,
        caster1 : caster1,
        caster2 : caster2,
        factionTeam1 : factionTeam1,
        factionTeam2 : factionTeam2,
        team1 : team1,
        team2 : team2,
        minutes : minutes
      });
    }
    event.preventDefault();
  });

  $("#btnStart").on('click', function(){
      socket.emit('Start');
  })

  $("#btnStop").on('click', function(){
      socket.emit('Stop');
  })

  $("#btnReset").on('click', function(){
      socket.emit('Reset');
  })

  $("#displayer").change(function () {
    $( this ).children("option:selected" ).each(function() {
      var displayer = $("#displayer").val()
      socket.emit('progressBarChanged', {
        displayer : displayer,
        verboseName : $( this ).html().toUpperCase(),
      });
    });
  }).change();

  $("#displayerStats").change(function () {
    $( this ).children("option:selected" ).each(function() {
    var  displayer = $("#displayerStats").val()
      socket.emit('statsChanged', {
        displayer : displayer,
      });
    });
  }).change();

  socket.on('broadcast',function(data) {
      console.log(data)
  });

});
