// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
var myLineChart;

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

for (let idx = 0; idx < data[0].values.length; idx++) {
  var item = data[0].values[idx];
  
  var d = new Date(item.date);
  var l = d.toLocaleDateString("it-IT").replace('/2020','') + ' ' + d.toLocaleTimeString("it-IT").substring(0,5)
  labels.push(l)

}

var datasets = [];

for (let n = 0; n < data.length; n++) {
  var serie = data[n];
  console.log('SERIE',serie);
  var dataset = {
    label: "SN " + serie.sn,
    lineTension: 0.3,
    backgroundColor: "rgba(78, 115, 223, 0.0)",
    borderColor: serie.color,
    pointRadius: 3,
    pointBackgroundColor: serie.color,
    pointBorderColor: serie.color,
    pointHoverRadius: 3,
    pointHoverBackgroundColor: serie.color,
    pointHoverBorderColor: serie.color,
    pointHitRadius: 10,
    pointBorderWidth: 2,
    data: [],
  };

  for (let x = 0; x < serie.values.length; x++) {
    var item = serie.values[x];
    dataset.data.push(item.currentPower);

  }
  datasets.push(dataset);

}
console.log('datasets',datasets)

myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
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
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
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
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + 'W';
        }
      }
    }
  }
});


}
