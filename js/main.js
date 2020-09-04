// set the dimensions and margins of the graph
var svg
var margin = {top: 20, right: 30, bottom: 50, left: 60},
    width = 1800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#line")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var promises = [];
promises.push(d3.csv("data/Triple_Doubles_Totals.csv"))
Promise.all(promises).then(callback);

function callback(data){
  total = data[0]
  console.log(total)

  var x = d3.scaleTime()
    .domain([1979,2020])
    .range([ 0, width ]);
  svg.append("g")
    .attr("class","xAxis")
    .attr("stroke", "white")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .tickFormat(d3.format("d"))
      .ticks(41)
    )
    .selectAll("text")
        .attr("class","xLabels")
        .attr("transform", "translate(0,5)rotate(-35)")
        .style("text-anchor", "end");
  
  var y = d3.scaleLinear()
    .domain([0, 200])
    .range([ height, 0 ]);

  svg.append("g")
  .attr("class","yAxis")
    .attr("stroke", "white")
    .call(d3.axisLeft(y));

  var path = svg.append("path")
    .datum(total)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Year)})
      .y(function(d) { return y(d.Count) })
      .curve(d3.curveMonotoneX)
      )
      path.lower()
}

