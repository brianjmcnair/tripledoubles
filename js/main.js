// set the dimensions and margins of the graph
var svg
var margin = {top: 50, right: 30, bottom: 40, left: 60},
    width = 1800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
var LBJ,LB,MEJ,JK, RW, JH, NJ, MJ, RR, GH;

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
promises.push(d3.csv("data/Lebron James_td_counts.csv"))
promises.push(d3.csv("data/Larry Bird_td_counts.csv"))
promises.push(d3.csv("data/Magic Johnson_td_counts.csv"))
promises.push(d3.csv("data/Jason Kidd_td_counts.csv"))
promises.push(d3.csv("data/Russell Westbrook_td_counts.csv"))
promises.push(d3.csv("data/James Harden_td_counts.csv"))
promises.push(d3.csv("data/Nikola Jokić_td_counts.csv"))
promises.push(d3.csv("data/Michael Jordan_td_counts.csv"))
promises.push(d3.csv("data/Rajon Rondo_td_counts.csv"))
promises.push(d3.csv("data/Grant Hill_td_counts.csv"))
Promise.all(promises).then(callback);

function callback(data){
  total = data[0]
  LBJ = data[1]
  LB = data[2]
  MEJ = data[3]
  JK = data[4]
  RW = data[5]
  JH = data[6]
  NJ = data[7]
  MJ = data[8]
  RR = data[9]
  GH = data[10]
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
    .attr("class", "mainLine")
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Year)})
      .y(function(d) { return y(d.Count) })
      .curve(d3.curveMonotoneX)
      )
      path.lower()
  

createDropdown(svg,x,y,LBJ,LB,MEJ,JK, RW, JH, NJ, MJ, RR, GH)
}
function createDropdown(svg,x,y,LBJ,LB,MEJ,JK, RW, JH, NJ, MJ, RR, GH){
  var ballers = ['LeBron James', 'Larry Bird', 'Magic Johnson', 'Jason Kidd','Russell Westbrook','James Harden','Nikola Jokić', 'Michael Jordan','Rajon Rondo', 'Grant Hill']

  var dropdown = d3.select(".dropdownDiv")
    .append("select")
    .attr("class","dropdown")
    .attr("id","dropdown")
    .on("change",function(){
      addPlayerLine(svg,x,y,LBJ,LB,MEJ,JK, RW, JH, NJ, MJ, RR, GH, this.value)
    })
  
  var titleOption = dropdown.append("option")
  .attr("class", "titleOption") 
  .attr("disabled", "true")
  .text("Select A Player...");

  var attrOptions = dropdown.selectAll("attrOptions")
        .data(ballers) //the list of data inside the dropdown menu
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
}
function addPlayerLine(svg,x,y,LBJ,LB,MEJ,JK, RW, JH, NJ, MJ, RR, GH, selectedBaller){
  var correctBaller
  if(selectedBaller == 'LeBron James'){
    correctBaller = LBJ
  }
  if(selectedBaller == 'Larry Bird'){
    correctBaller = LB
  }
  if(selectedBaller == 'Magic Johnson'){
    correctBaller = MEJ
  }
  if(selectedBaller == 'Jason Kidd'){
    correctBaller = JK
  }
  if(selectedBaller == 'Russell Westbrook'){
    correctBaller = RW
  }
  if(selectedBaller == 'James Harden'){
    correctBaller = JH
  }
  if(selectedBaller == 'Nikola Jokić'){
    correctBaller = NJ
  }
  if(selectedBaller == 'Michael Jordan'){
    correctBaller = MJ
  }
  if(selectedBaller == 'Rajon Rondo'){
    correctBaller = RR
  }
  if(selectedBaller == 'Grant Hills'){
    correctBaller = GH
  }
  
  var ballerPath = svg.append("path")
    .datum(correctBaller)
    .attr("class","mainLine")
    .attr("fill","none")
    .attr("stroke","green")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Year)})
      .y(function(d) { return y(d.Count) })
      .curve(d3.curveMonotoneX)
      )
      path.lower()
}
