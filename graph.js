var socket = io();
socket.emit('subscribe', {recap:true});


$(function(){

  socket.on('recapData',function(data) {
    var colorTeam1 = undefined
    if (data.t1.faction == 1) { //VS
      colorTeam1 = "#612597";
    } else if (data.t1.faction == 2) { // NC
      colorTeam1 = "#1d4698";
    } else if (data.t1.faction == 3) { // TR
      colorTeam1 = "#b90d01";
    }

    var colorTeam2 = undefined
    if (data.t2.faction == 1) { //VS
      colorTeam2 = "#612597";
    } else if (data.t2.faction == 2) { // NC
      colorTeam2 = "#1d4698";
    } else if (data.t2.faction == 3) { // TR
      colorTeam2 = "#b90d01";
    }


    var chart1 = new CanvasJS.Chart("chart1Container", {
      backgroundColor: "rgba(0,0,0,0)",
      axisY:{
        includeZero: false,
        lineColor: "white",
        gridColor: "white",
        labelFontColor: "white",
        tickColor: "white",
      },
      axisX: {
        reversed:  true,
        includeZero: false,
        lineColor: "white",
        gridColor: "white",
        labelFontColor: "white",
        tickColor: "white",
        labelFormatter: function (e) {
          var timer = e.value
          var hours = timer.getUTCHours();
          var minutes = (hours * 60) + timer.getMinutes();
          var seconds = timer.getSeconds();
          return (minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds)
        }
      },
      data: [  //array of dataSeries
        {
          type: "stepLine",
          name: data.t1.name,
          color:colorTeam1,
          lineThickness: 4,
          markerSize: 10,
          xValueType: "dateTime",
          dataPoints: data.data.t1.captureData
        },
        {
          type: "stepLine",
          name: data.t2.name,
          lineThickness: 4,
          markerSize: 10,
          color:colorTeam2,
          xValueType: "dateTime",
          dataPoints: data.data.t2.captureData
        }
      ]
    });

    chart1.render();
    var chart2 = new CanvasJS.Chart("chartContainer", {
      //theme: "light2", // "light1", "light2", "dark1", "dark2"
      axisY:{
        includeZero: false,
        lineColor: "white",
        gridColor: "white",
        labelFontColor: "white",
        tickColor: "white",
      },
      backgroundColor: "rgba(0,0,0,0)",
      axisX: {
        reversed:  true,
        includeZero: false,
        lineColor: "white",
        gridColor: "white",
        labelFontColor: "white",
        tickColor: "white",
        labelFormatter: function (e) {
          var timer = e.value
          var hours = timer.getUTCHours();
          var minutes = (hours * 60) + timer.getMinutes();
          var seconds = timer.getSeconds();
          return (minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds)
        }
      },
      data: [{
        type: "line",
        name: data.t1.name,
        color:colorTeam1,
        xValueType: "dateTime",
        lineThickness: 4,
        markerSize: 10,
        dataPoints: data.data.t1.killData,
      },
      {
        type: "line",
        name: data.t2.name,
        color:colorTeam2,
        xValueType: "dateTime",
        lineThickness: 4,
        markerSize: 10,
        dataPoints: data.data.t2.killData,
      }]
    });
    chart2.render();

    $(".canvasjs-chart-credit").remove()

  });
});
