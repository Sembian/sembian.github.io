//https://bl.ocks.org/flunky
//https://observablehq.com/@d3/d3-line
//https://bl.ocks.org/wdickerson/bd654e61f536dcef3736f41e0ad87786
//https://bl.ocks.org/martinjc/980a2fcdbf0653c301dc2fb52750b0d9
//https://bl.ocks.org/d3noob
// Data preparation.
var margin = {top: 50, right: 120, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;
    
    const x_year = d3.scaleBand();

// Tooltip handler.
function mouseover() {
  // Get data.
  const barData = d3.select(this).data()[0];
  //debugger;
  const bodyData = [
    ['Cause', barData.cause],
    ['Adjusted Rate of Death', barData.rate],
    ['Year', barData.year],
    
  ];

  // Build tip.
  const tip = d3.select('.tooltip');

  tip
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`)
    .transition()
    .style('opacity', 0.98);

  tip.select('h3').html(`YEAR: ${barData.year}, ${barData.category}`);
  tip.select('h4').html(`${barData.cause}, ${barData.rate}`);

  d3.select('.tip-body')
    .selectAll('p')
    .data(bodyData)
    .join('p')
    .attr('class', 'tip-info')
    .html(d => `${d[0]}: ${d[1]}`);
}

function mousemove() {
  d3.select('.tooltip')
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`);
}

function mouseout() {
  d3.select('.tooltip')
    .transition()
    .style('opacity', 0);
}

  function ready(data){
    var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

   
 
    var nested = d3.nest()
      .key(function(d) { return d.cause; })
      .entries(data);
      console.log('Local CSV in ready!:',nested);
    
     var nested = d3.nest()
     .key(function(d) { return d.scene2; })
     .entries(data);
     console.log('Local CSV in ready!:',nested);

    
    const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
    const xValue = d=> +d.year;

    const yValue = d => +d.rate;

    const colorValue = d =>d.cause;

    const xScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .rangeRound([0, innerWidth])
    .nice()
    
    const yScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.rate; }))
    .range([innerHeight, 0])
    .nice();

    const colorScale = d3.scaleOrdinal(colorValue);
    const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxis = d3.axisBottom(xScale).ticks(17).tickFormat(d3.format("d"));
    
  
  const yAxis = d3.axisLeft(yScale)
   

    const yAxisG = g.append('g').call(yAxis)
    yAxisG.selectAll('.domain').remove();

    yAxisG.append('text')
    
    .attr('y', -40)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text("Age-Adjusted Death Rate per 100,000 population");

    const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
  
  xAxisG.select('.domain').remove();
  
  xAxisG.append('text')
      
      .attr('y', 40)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text("Year");

      const lineGenerator = d3.line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveLinear);
    
    const lastYValue = d =>
      yValue(d.values[d.values.length - 1]);

      const nestedmap = d3.nest()
        .key(colorValue)
        .entries(data)
  
  colorScale.domain(nestedmap.map(d => d.key));
  var res = nested.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(d3.schemeDark2)

   
    
  const path = g.selectAll(".line")
  .data(nested)
  .enter()
  .append("path")
    .attr("fill", "none")
    .style("mix-blend-mode", "multiply")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke", function(d){ return color(d.key) })
    .attr('d', d => lineGenerator(d.values));

  g.selectAll("dot")
     .data(data)
   .enter().append("circle")
     .attr("cx", function(d) { return xScale(+d.year); })
     .attr("cy", function(d) { return yScale(+d.rate); })
     .attr("r", function(d) {            // <== Add these
      if (+d.year >= 2013 && d.cause === "Alzheimer's disease") 
      {
        return 5}  // <== Add these
      else { 
        if (+d.year >= 2013 && d.cause === "Unintentional injuries") {
        return 5
        }
        else{return 3;}

      } 
                  // <== Add these
      ;})                                     // <== Add these
     // Tooltip interaction.
   
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)
     .style("fill", function(d) {            // <== Add these
      if (+d.year >= 2013 && d.cause === "Alzheimer's disease") {return "red"}  // <== Add these
      else { return "gray" }             // <== Add these
      ;})                                     // <== Add these
      
    
      ;

  /*g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text("Rate");*/

  // Draw header.
  const header = svg
    .append('g')
    .attr('class', 'line-chart-header')
    .attr('transform', `translate(0,${-margin.top * 0.4})`)
    .append('text');

  header.append('tspan').text('Health, United States - Causes of Deaths');

  header
    .append('tspan')
    .attr('x', 0)
    .attr('dy', '1.5em')
    .style('font-size', '0.9em')
    .style('fill', '#555')
    .text('Age-adjusted death rates for selected causes of death, by sex, race, and Hispanic origin: United States, 2000–2017');

    header
    .append('tspan')
    .attr('x', 0)
    .attr('dy', '1.5em')
    .style('font-size', '0.7em')
    .style('fill', '#555')
    .text('Data Source Centers for Disease Control and Prevention - National Center for Health Statistics - Table 005');

   g.selectAll(".text")
    .data(nested)
    .enter()
    .append('text')
    .text(function(d){ return d.key})
    .attr('class', 'chart-labels')
    .attr('x',innerWidth+10)
    .attr('y',function(d){
      var lastData = d.values.find(d => +d.year === 2017)
      return yScale(lastData.rate);
    })
    
    
    

  }

  function getSmoothInterpolation(data) {
    return function (d, i, a) {
        var interpolate = d3.scaleLinear()
            .domain([0,1])
            .range([1, data.length + 1]);
  
        return function(t) {
            var flooredX = Math.floor(interpolate(t));
            var weight = interpolate(t) - flooredX;
            var interpolatedLine = data.slice(0, flooredX);
                
            if(flooredX > 0 && flooredX < 31) {
                var weightedLineAverage = data[flooredX].y * weight + data[flooredX-1].y * (1-weight);
                interpolatedLine.push({"x":interpolate(t)-1, "y":weightedLineAverage});
                }
        
            return lineFunction(interpolatedLine);
            }
        }
    }
  
  // Data Utilities
  const parseNA = string => (string ==='NA' ? undefined: string);
  const parseDate = string => d3.timeParse('%Y-%m-%d')(string);
  
  // Type Conversion
  function type(d){
      

      return{
        year: parseInt(+d.Year),
        cause: d["Cause of death"],
        category: d["Category"],
        rate: parseFloat(+d.Rate),
        scene2: d["Category"] + "-" + d["Cause of death"]
        
      }
      

  }
var data;
// Load data
d3.csv('data.csv',type).then( res => {
    console.log('Local CSV:', res);
    data = res;
    initScreen(res);
});

function initScreen(data){
  //FILTER SCENE 1
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Diseases of heart":true,"Malignant neoplasms":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={};//cities to be shown
    
    data = data.filter(function(d){return d.category == "All" && 
      d.cause != "All causes"
      && filterData[d.cause] == true
      && +d.year >= 2000
     });
     d3.selectAll("svg > *").remove();
     ready(data);
     //
     //
     //
    
     //
     //

}
function secondScreen(data){
  //FILTER SCENE 1
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Diseases of heart":true,"Malignant neoplasms":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={};//cities to be shown
    
    /*data = data.filter(function(d){return d.category == "All" && 
      d.cause != "All causes"
      && filterData[d.cause] == true
      && +d.year >= 2000
     });*/
     //
     //
     //
    //FILTER SCENE 2
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true};//cities to be shown
    
    var filterData={"Diseases of heart":true};//cities to be shown]
    var filterData={"Unintentional injuries":true};
    var filterData={"Alzheimer's disease":true};//cities to be shown
    //var filterData={"Alzheimer's disease":true,"Diseases of heart":true,"Malignant neoplasms":true,"Unintentional injuries":true,};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true};//cities to be shown
    //var filterData={};//cities to be shown
    var categoryFilter = {"Female":true,"Male":true}
    var originFilter = {"White":true, "Black or African American":true,"Asian or Pacific Islander":true,"Hispanic or Latino":true}
    data = data.filter(function(d){
    
      return d.cause != "All causes" &&
    
      filterData[d.cause] == true && 
      categoryFilter[d.category] == true
     });
     d3.selectAll("svg > *").remove();
     ready(data)
     //
     //
     //
     
}

function thirdScreen(data){
  //FILTER SCENE 1
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Diseases of heart":true,"Malignant neoplasms":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={};//cities to be shown
    
    /*data = data.filter(function(d){return d.category == "All" && 
      d.cause != "All causes"
      && filterData[d.cause] == true
      && +d.year >= 2000
     });*/
     //
     //
     //
    //FILTER SCENE 2
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true};//cities to be shown
    
    var filterData={"Diseases of heart":true};//cities to be shown]
    var filterData={"Unintentional injuries":true};
    var filterData={"Alzheimer's disease":true};//cities to be shown
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true,"Unintentional injuries":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true};//cities to be shown
    //var filterData={};//cities to be shown
    var categoryFilter = {"Female":true,"Male":true}
    var originFilter = {"White":true, "Black or African American":true,"Asian or Pacific Islander":true,"Hispanic or Latino":true}
    data = data.filter(function(d){
    
      return d.cause != "All causes" &&
      
      filterData[d.cause] == true && 
      originFilter[d.category] == true
  
      
     });
     d3.selectAll("svg > *").remove();
     ready(data)
     //
     //
     //
     
}

function fourthScreen(data){
  //FILTER SCENE 1
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Diseases of heart":true,"Malignant neoplasms":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={};//cities to be shown
    
    /*data = data.filter(function(d){return d.category == "All" && 
      d.cause != "All causes"
      && filterData[d.cause] == true
      && +d.year >= 2000
     });*/
     //
     //
     //
    //FILTER SCENE 2
    //var filterData={"Diseases of heart":true,"Malignant neoplasms":true};//cities to be shown
    
    var filterData={"Diseases of heart":true};//cities to be shown]
    var filterData={"Unintentional injuries":true};
    var filterData={"Alzheimer's disease":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true,"Diseases of heart":true,"Malignant neoplasms":true,"Unintentional injuries":true,"Chronic lower respiratory diseases":true};//cities to be shown
    //var filterData={"Diabetes mellitus":true,"Alzheimer's disease":true};//cities to be shown
    //var filterData={};//cities to be shown
    var categoryFilter = {"Female":true,"Male":true}
    var originFilter = {"White":true, "Black or African American":true,"Asian or Pacific Islander":true,"Hispanic or Latino":true}
    data = data.filter(function(d){
    
      return d.cause != "All causes" &&
    
      filterData[d.cause] == true && 
      categoryFilter[d.category] == true
     });
     d3.selectAll("svg > *").remove();
     ready(data)
     //
     //
     //
     
}

