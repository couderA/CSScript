var socket = io();
socket.emit('subscribe', {admin:true});

$(function(){
  $( "#matchInitializer" ).submit(function( event ) {
    server = parseInt($("#selectServer").val())
    continent = parseInt($("#selectContinent").val())
    smashNumber = $("#smashnumber").val()
    caster1 = $("#caster1").val().toUpperCase()
    caster2 = $("#caster2").val().toUpperCase()
    fc1 = $("#fc1").val().toUpperCase()
    fc2 = $("#fc2").val().toUpperCase()
    team1 = $("#team1").val().toUpperCase()
    team2 = $("#team2").val().toUpperCase()
    factionTeam1 = parseInt($("#selectFactionTeam1").val())
    factionTeam2 = parseInt($("#selectFactionTeam2").val())
    minutes = $("#matchLength").val()
    if (caster1 != "" && caster2 != "" && factionTeam1 != factionTeam2 && team1 != "" && team2 != "") {
      $( "#btnServer").addClass("d-none")
      $( ".buttonsDiv").removeClass("d-none")
      socket.emit('initializeMatch', {
        server : server,
        continent : continent,
        smashNumber: smashNumber,
        caster1 : caster1,
        caster2 : caster2,
        fc1:fc1,
        fc2:fc2,
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
    if (confirm("Are you sure you wanna STOP")) {
      socket.emit('Stop');
      $( "#btnServer").removeClass("d-none")
      $( ".buttonsDiv").addClass("d-none")
    }
  })

  $("#btnReset").on('click', function(){
    if (confirm("Are you sure you wanna RESET")) {
      socket.emit('Reset');
      $( "#btnServer").removeClass("d-none")
      $( ".buttonsDiv").addClass("d-none")
    }
  })

  $("#displayer").change(function () {
    $( this ).children("option:selected" ).each(function() {
      var displayer = $("#displayer").val()
      socket.emit('progressBarChanged', {
        displayer : displayer,
        verboseName : $( this ).html().toUpperCase(),
      });
    });
  });

  $("#displayerStats").change(function () {
    $( this ).children("option:selected" ).each(function() {
      var  displayer = $("#displayerStats").val()
      socket.emit('statsChanged', {
        displayer : displayer,
      });
    });
  });

  socket.on('broadcast',function(data) {
    $("#selectServer").val(data.server)
    $("#selectContinent").val(data.continent)
    $("#smashnumber").val(data.smashNumber)
    $("#caster1").val(data.caster1)
    $("#caster2").val(data.caster2)
    $("#fc1").val(data.team1.fc)
    $("#fc2").val(data.team2.fc)
    $("#team1").val(data.team1.name)
    $("#team2").val(data.team2.name)
    $("#selectFactionTeam1").val(data.team1.faction)
    $("#selectFactionTeam2").val(data.team2.faction)
    $("#matchLength").val(data.minutes)
    $("#displayer").val(data.progressBar)
    $("#displayerStats").val(data.statsDisplayed)
    if (data.hasBeenInit) {
      $( "#btnServer").addClass("d-none")
      $( ".buttonsDiv").removeClass("d-none")
    }
  });

});
