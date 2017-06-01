var ChartHelper = (function ($) {

  var my = {},

  fromYear, fromMonth, toYear, toMonth, points, heathrowData;

  function Initialize() {
    var from = $('#year_from').val();
    var to = $('#year_to').val();
    fromYear = from.substring(0,4);
    fromMonth = parseInt(from.substring(4,6));
    toYear = to.substring(0,4);
    toMonth = parseInt(to.substring(4,6));
  }

  function Selected(){
    var sections = ["tmax_C", "tmin_C", "sunshine_hours", "rain_mm"];
    for ( var k = 0; k < sections.length; k++ ) {
    if ( $("#radio_" + sections[k]).is(':checked') ) {
      console.log(sections[k])
      return sections[k];
      }
    }
  }

  function Display(i, j, selection){
    for (i; i <= j; i++) {
      var pointsYearMonth = heathrowData[i]['yyyy'] + heathrowData[i]['month'];
      var pointsSelection = heathrowData[i][selection];
      points.push({ x: new Date( heathrowData[i]['yyyy'], heathrowData[i]['month']), y : parseFloat(pointsSelection) });
    }
    if (points.length > 36)
      GraphGenerate("YYYY", "year", selection);
    else
      GraphGenerate("MMM/YYYY", "month", selection);
  }

  function GraphGenerate(valueFormat, intervalType, selection) {
    var chart = new CanvasJS.Chart("chartContainer",
      {
        theme: "theme2",
        title:{
          text: selection + " - per time"
        },
        animationEnabled: true,
        axisX: {
          valueFormatString: valueFormat,
          interval:1,
          intervalType: intervalType

        },
        axisY:{
          includeZero: false

        },
        data: [
          {
            type: "line",
            lineThickness: 2,
            dataPoints: points
          }
        ]
      });
        chart.render();
  }

  my.fetchData = function () {
    Initialize();
    $.getJSON('./heathrow-weatherstation.json', function(data) {
    var i, j;
    var l = data.length;
    heathrowData = data;
    for (i = 0; i < l; i++) {
      if (data[i]['yyyy'] == fromYear) {
        if(data[i]['month'] == fromMonth) {
          points = [];
          console.log("start: " + data[i]['yyyy'] + data[i]['month']);
          break;
        }
      }
    }
    for (j = i; j < l; j++ ) {
      if (data[j]['yyyy'] == toYear)
        if (data[j]['month'] == toMonth){
          console.log("end: " + data[j]['yyyy'] + data[j]['month']);
            break;
          }
    }
    console.log(Selected());
    Display(i, j, Selected());
        });
  };

  my.initialBasicChart=function(){
      var chart = new CanvasJS.Chart("chartContainer", {
        theme: "theme2",
        title: { text:"Heathrow airport weather conditions line chart"
        }, axisX: {
          valueFormatString: "YYYY",
          interval:1,
          intervalType: "year"

        },
        axisY:{
          includeZero: false
        },
        data: [
          {
            type: "line",
            lineThickness: 2,
            dataPoints: []
          }
        ]
      });
    chart.render();
  }

  return my;
}(jQuery));


$('#btn').click(function() {
  ChartHelper.fetchData();
});

window.onload = function () {
  ChartHelper.initialBasicChart();
}
