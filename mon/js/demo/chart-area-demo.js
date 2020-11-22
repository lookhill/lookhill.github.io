// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
var myLineChart;
var color = 'rgba(255, 99, 132,0.7)';

function newDate(days) {
  return moment().add(days, 'd').toDate();
}

function newDateString(days) {
  return moment().add(days, 'd').format();
}


function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


function initChart(data){
// Area Chart Example
try{
  myLineChart.destroy()
}catch(e){
  console.log('Error destroing chart')
}

var ctx = document.getElementById("myAreaChart");
var labels = [];
var chartData = [];

/*for (let idx = 0; idx < data[0].values.length; idx++) {
  var item = data[0].values[idx];
  
  var d = new Date(item.date);
  var l = d.toLocaleDateString("it-IT").replace('/2020','') + ' ' + d.toLocaleTimeString("it-IT").substring(0,5)
  labels.push(l)

}*/

var datasets = [];

for (let n = 0; n < data.length; n++) {
  var serie = data[n];
  console.log('SERIE',serie);
  var dataset = {
    label: "SN " + serie.sn,
    lineTension: 0.3,
    backgroundColor: "rgba(78, 115, 223, 0.0)",
    borderColor: serie.color,
    borderWidth:2,
    pointRadius: 2,
    pointBackgroundColor: serie.color,
    pointBorderColor: serie.color,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: serie.color,
    pointHoverBorderColor: serie.color,
    pointHitRadius: 10,
    pointBorderWidth: 2,
    data: [],
  };

  for (let x = 0; x < serie.values.length; x++) {
    var item = serie.values[x];
    dataset.data.push({x:
      moment(item.date).format(), y:item.currentPower});

  }
  datasets.push(dataset);


  if(serie.sn == 'ccccPEL4600N18C17009'){
    var color = 'rgba(255, 99, 132,0.3)';
    var datasetHalf = {
      label: "Metà",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.5)",
      borderColor: color,
      borderWidth:1,
      pointRadius: 0,
      pointBackgroundColor: color,
      pointBorderColor: color,
      pointHoverRadius: 3,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color,
      pointHitRadius: 0,
      pointBorderWidth: 0,
      data: [],
    };

    for (let x = 0; x < serie.values.length; x++) {
      var item = serie.values[x];
      datasetHalf.data.push({x:new Date(item.date).toISOString().split('.')[0] + '+01:00', y:item.currentPower / 2.0});
  
    }
    datasets.push(datasetHalf);
  }

}
console.log('datasets',datasets)

myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    //labels: labels,
    datasets: datasets,
    
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
            displayFormats: {
                minute: 'hh:mm'
            }
        },
        display: true,
        scaleLabel: {
          display: false,
          labelString: 'Date'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return number_format(value/1000.00) + 'kW';
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      //displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        title: function(tooltipItem, chart) {
          var d = tooltipItem[0].xLabel;
          var f = moment(d).format('DD/MM/YYYY HH:mm')
          return f;
        },
        label: function(tooltipItem, chart) {
          console.log(tooltipItem)
          //var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return number_format(tooltipItem.yLabel/1000.0,3) + 'kW';
        },
        labelTextColor: function(tooltipItem, chart) {
            return '#543453';
        }      
      }
    }
  }
});


}

window.randomScalingFactor = function() {
  return Math.round(Math.random(10000));
};
