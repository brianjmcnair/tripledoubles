// set the dimensions and margins of the graph
var svg, x, y, focus, focusText, total, rect, mouseG, tooltip, tooltiptext;
var margin = {top: 50, right: 100, bottom: 100, left: 100},
    width = (window.innerWidth*0.95) - margin.left - margin.right,
    height = (window.innerHeight*0.9) - margin.top - margin.bottom;
var LBJ,LB,MEJ,JK, RW, JH, NJ, MJ, RR, GH;

// append the svg object to the body of the page
var svg = d3.select("#line")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
  .attr("class","tdAxisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "2em")
  .style("text-anchor", "middle")
  .text("Triple Doubles");

svg.append("text")
  .attr("class","yearAxisLabel")
  .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 25) + ")")
  .style("text-anchor", "middle")
  .text("Year");

var legend_keys = ["NBA", "Selected Player"]

var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            return "translate(" + (width*.8) + "," + (i*25)*1.15+")";
        });

lineLegend.append("text").text(function (d) {return d;})
    .attr("transform", "translate(25,15)"); 

lineLegend.append("rect")
    .attr("fill", function (d, i) {
      if(d == "NBA"){return "purple"}
      else{return "Green"}
     })
    .attr("width", 15).attr("height", 15);

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

  x = d3.scaleLinear()
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
        .style("text-anchor", "end")
  
  y = d3.scaleLinear()
    .domain([0, 200])
    .range([ height, 0 ]);

  svg.append("g")
  .attr("class","yAxis")
    .attr("stroke", "white")
    .call(d3.axisLeft(y));

  var g = svg.append("g")
    .attr("class","total")    

  var path = g.append("path")
    .datum(total)
    .attr("class", "mainLine")
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 1.75)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Year)})
      .y(function(d) { return y(d.Count) })
      .curve(d3.curveMonotoneX)
      )
      path.lower()

  var totalLength = path.node().getTotalLength();

  path
  .attr("stroke-dasharray", totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
  .duration(3000)
  .attr("stroke-dashoffset", 0);

  mouseG = svg.append("g")
  .attr("class", "mouse-over-effects"); 

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "white")
    .style("stroke-width", "1px")

  tooltip = g.append("g")                                
    .style("display", "none");  

    // append the circle at the intersection               
  tooltip.append("circle")                                 
    .attr("class", "totalCircle")                                                            
    .style("stroke", "purple")  
    .style("fill","black")                         
    .attr("r", 9);

  tooltiptext = tooltip.append("text")
    .attr("class","tooltip-text")
    .attr("stroke","white")

  bisect = d3.bisector(function(d) { return d.Year; }).left

  rect = svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', function() { 
      tooltip.style("display", null),
      tooltiptext.style("display",null)
      mouseG.style("opacity","1"),
      mouseG.lower(); 
      })
    .on('mouseout', function() { 
      tooltip.style("display", "none"),
      tooltiptext.style("display","none")
      mouseG.style("opacity","0"); 
      })
    .on('mousemove', mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisect(total, x0, 1),
          d0 = total[i - 1],
          d1 = total[i],
          d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
          tooltip.select("circle.totalCircle")                           
              .attr("transform", "translate(" + x(d.Year)+"," + y(d.Count) + ")")
          tooltiptext
              .text("Triple Doubles: "+d.Count)
              .attr("transform","translate(" + (x(d.Year) +10)+ "," + (y(d.Count) - 10)+ ")");
          d3.select(".mouse-line")
              .attr("d", function() {
                var m = "M" + x(d.Year) + "," + height;
                m += " " + x(d.Year) + "," + 0;
                return m;
              })
  }

createDropdown(svg,x,y)
}

function createDropdown(svg,x,y){
  var ballers = {'LeBron James':'LBJ', 'Larry Bird':'LB', 'Magic Johnson':'MEJ', 'Jason Kidd':'JK','Russell Westbrook':'RW','James Harden':'JH','Nikola Jokić':'NJ', 'Michael Jordan':'MJ','Rajon Rondo':'RR', 'Grant Hill':'GH'}

  var dropdown = d3.select(".dropdownDiv")
    .append("select")
    .attr("class","dropdown")
    .attr("id","dropdown")
    .on("change",function(){
      addPlayerLine(svg,x,y, this.value, ballers)
    })
  
  var titleOption = dropdown.append("option")
  .attr("class", "titleOption") 
  .attr("disabled", "true")
  .text("Select A Player...");

  var attrOptions = dropdown.selectAll("attrOptions")
        .data(Object.keys(ballers)) //the list of data inside the dropdown menu
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
}
function addPlayerLine(svg,x,y,selectedBaller, ballers){
  svg.selectAll("#ballerLine")
    .remove()
  var select;

  for(var b in ballers){
      if(b == selectedBaller){
          select = String(ballers[b])
      }
  };

  select = eval(select)

  var g = svg.append("g")
    .attr("class","select")

  var ballerPath = g.append("path")
    .datum(select)
    .attr("id","ballerLine")
    .attr("fill","none")
    .attr("stroke","green")
    .attr("stroke-width", 1.75)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Year)})
      .y(function(d) { return y(d.Count)})
      .curve(d3.curveMonotoneX)
      )
     
  var totalLength = ballerPath.node().getTotalLength();

  ballerPath
    .attr("stroke-dasharray", totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(3000)
    .attr("stroke-dashoffset", 0);

  var tooltip2 = g.append("g")                                
    .style("display", "none");  

    // append the circle at the intersection               
  tooltip2.append("circle")                                 
    .attr("class", "ballerCircle")                                                            
    .style("stroke", "green")  
    .style("fill","black")                         
    .attr("r", 9);
  
  tooltiptext2 = tooltip2.append("text")
    .attr("class","tooltip-text2")
    .attr("stroke","white")

  bisect = d3.bisector(function(d) { return d.Year; }).left

  rect
    .on('mouseover', function() { 
      tooltip.style("display", null),
      tooltiptext.style("display",null)
      mouseG.style("opacity","1"),
      mouseG.lower()
      tooltip2.style("display", null),
      tooltiptext2.style("display",null);
    })
    .on('mouseout', function() { 
      tooltip2.style("display", "none"),
      tooltip.style("display", "none"),
      tooltiptext.style("display","none"),
      tooltiptext2.style("display","none"),
      mouseG.style("opacity","0"); 
      })
    .on('mousemove', mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisect(total, x0, 1),
          d0 = total[i - 1],
          d1 = total[i],
          d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
          i2 = bisect(select, x0, 1),
          d0b = select[i2 - 1],
          d1b = select[i2],
          d2 = x0 - d0b.Year > d1b.Year - x0 ? d1b : d0b;
          tooltip.select("circle.totalCircle")                           
              .attr("transform", "translate(" + x(d.Year) + "," + y(d.Count) + ")")
          tooltiptext
              .text("Triple Doubles: "+d.Count)
              .attr("transform","translate(" + (x(d.Year) +10)+ "," + (y(d.Count) - 10)+ ")");
          d3.select(".mouse-line")
              .attr("d", function() {
                var m = "M" + x(d.Year) + "," + height;
                m += " " + x(d.Year) + "," + 0;
                return m;
              })
          tooltip2.select("circle.ballerCircle")                     
              .attr("transform", "translate(" + x(d2.Year) + "," + y(d2.Count) + ")")
          tooltiptext2
              .text("Triple Doubles: "+d2.Count)
              .attr("transform","translate(" + (x(d2.Year) +10)+ "," + (y(d2.Count) - 10)+ ")");
  }
  d3.select('.xAxis')
  .raise();
  ballerPath.lower()
}