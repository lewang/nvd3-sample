function Nvd3Graph ( ) {
  var svg,
      chart,
      self = this;

  var generateData = function ( ) {
    var numberOfPoints = 20,
        graphData = [],
        series,
        i, j;

    for (i = 0; i < 3; i++) {
      series = [];
      for (var j = 0; j < numberOfPoints; j++) {
        series.push({x: (j+1), y: ((i+1) * (j+1))});
      }
      graphData.push({ values: series})
    }

    graphData[0].key = "First";
    graphData[1].key = "Second";
    graphData[2].key = "Third";

    return graphData;
  };

  var setupSvg = function ( ) {
    var svgAttributes = {
      width: 700,
      height: 300,
      padding: 25,
      margin : {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10
      }
    };

    svg = d3.select('#home svg');
    svg.style({
      'width': svgAttributes.width + svgAttributes.margin.left + svgAttributes.margin.right,
      'height': svgAttributes.height + svgAttributes.margin.top + svgAttributes.margin.bottom,
      'padding': svgAttributes.padding,
      'margin': '0 auto'
    });
    svg.datum( generateData() );
    svg.transition().duration(500);
    self.svg = svg;
  };

  var setupChart = function ( ) {
    chart = nv.models.lineChart();
    chart.options({
      x: getX,
      y: getY,
      noData: "Not enough data to graph",
      transitionDuration: 500,
      showLegend: true,
      showXAxis: true,
      showYAxis: true,
      rightAlignYAxis: false
    });

    //// test setting margins

    // chart.margin({top:100,bottom:100,left:100,right:100});
    chart.forceY([0]);

    chart.xAxis
      .tickFormat(xAxisFormatter)
      .axisLabel("Days since it happened");
    chart.yAxis
      .tickFormat(yAxisFormatter)
      .axisLabel("Calls per day")
      .tickFormat(function (val) {
        return "foo  bar bas z " + val
      });

    self.chart = chart;
  };

  var renderChart = function ( ) {
    chart(svg);
  };

  var getX = function (point, index) {
    return point.x;
  };

  var getY = function (point, index) {
    return point.y;
  };

  var xAxisFormatter = function (xValue) {
    return d3.format(',d')(xValue);
  };

  var yAxisFormatter = function (yValue) {
    return yValue.toString();
  };

  var resizeCallback = function ( ) {
    console.log("resize callback triggered");
    chart.update();
  };

  var addEvents = function ( ) {
    nv.utils.windowResize( resizeCallback );
    chart.dispatch.on('stateChange', stateChangeCallback);
    chart.legend.dispatch.on('legendMouseover', legendMouseoverCallback);
  };

  var stateChangeCallback = function ( ) {
    console.log("state of the chart changed");
    console.log(arguments);
  };

  var legendMouseoverCallback = function ( ) {
    console.log("you moused over the legend");
  };

  this.initialize = function () {
    setupSvg();
    setupChart();
    renderChart();
    addEvents();
    return this.chart;
  };

}

var myCallback = function ( ) {
  console.log("addGraph callback triggered");
};

var graph = new Nvd3Graph();
nv.addGraph(graph.initialize, myCallback);
