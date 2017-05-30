
var from_y, from_m, to_y, to_m, year_range, mydata;

$('#btn').click(function() {
  var from = document.getElementById('year_from').value; 
  from_y = from.substring(0,4);
  from_m = parseInt(from.substring(4,6));
  var to = document.getElementById('year_to').value;
  to_y = to.substring(0,4);
  to_m = parseInt(to.substring(4,6));
  $.getJSON('./heathrow-weatherstation.json', function(data) {         
    //alert(JSON.stringify(data[0]['month']));
    var i, j;
    var l = data.length;
    mydata = data;
    for (i = 0; i < l; i++) { 
      if (data[i]['yyyy'] == from_y) {
        if(data[i]['month'] == from_m) {
          year_range = [];
          console.log("start: " + data[i]['yyyy'] + data[i]['month']);
          break;
        } 
      }
    }
    for (j = i; j < l; j++ ) {
      if (data[j]['yyyy'] == to_y)
        if (data[j]['month'] == to_m){
          console.log("end: " + data[j]['yyyy'] + data[j]['month']);
            break;
          }
    }
    var selection = selected();
    display(i, j, selection); 
  }); 
});

function selected(){
 var sections=["tmax_C", "tmin_C", "sunshine_hours", "rain_mm"];
    for ( var k = 0; k < sections.length; k++ ) {
    if ( document.getElementById("radio_"+sections[k]).checked ) {
      console.log(sections[k])
      return sections[k];
      }
    }
}
  
function display(i, j, selection){
  for(i; i <= j; i++) {
      var mydata_year_month = mydata[i]['yyyy'] + mydata[i]['month'];
      var mydata_selection = mydata[i][selection];
      year_range.push({ x: new Date( mydata[i]['yyyy'], mydata[i]['month']), y : parseFloat(mydata_selection) });
    }
      console.log(year_range);
      graphgenerate();
}

function graphgenerate() {
  var chart = new CanvasJS.Chart("chartContainer",
      {
        theme: "theme2",
        title:{
          text: "selected element - per time"
        },
        animationEnabled: true,
        axisX: {
          valueFormatString: "MMM",
          interval:1,
          intervalType: "year"
          
        },
        axisY:{
          includeZero: false
          
        },
        data: [
          {
            type: "line",
            lineThickness: 4,        
            dataPoints: year_range
          }
        ] 
      });

	chart.render();
}
  
window.onload = function () {
}
