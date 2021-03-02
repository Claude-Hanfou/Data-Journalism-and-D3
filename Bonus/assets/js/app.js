var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params was 
var chosenXAxis = "poverty"; 
var chosenYAxis = "healthcare"

//-----------------------------------------------------------------------------------------

// function used for updating x-scale var upon click on axis label
function xScale(newsData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(newsData, d => d[chosenXAxis]) * 0.8,
      d3.max(newsData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

//function used for updating y-scale var upon click on axis label
function yScale(newsData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(newsData, d => d[chosenYAxis]) * 0.8,
      d3.max(newsData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

//----------------------------------------------------------------------------------------------
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// // function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//----------------------------------------------------------------------------------------------------

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
    console.log(circlesGroup)

  return circlesGroup;
}

// // Function used for the y axis
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
    console.log(circlesGroup)

  return circlesGroup;
}
//------------------------------------------------------------------------------------------

function renderText(textGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
    

  return textGroup;
}


//-----------------------------------------------------------------------------------------------

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "Poverty:";
  
  }
  else if (chosenXAxis === "age") {
    label = "Age:";
  }
  else {
    label = "Income: $";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state},${d.abbr}<br>${label} ${d[chosenXAxis]} <br> ${chosenYAxis} : ${d[chosenYAxis]}%`);
    });


  circlesGroup.call(toolTip);

  // circlesGroup.on("mouseover", function(data) {
  //   toolTip.show(data);
  // })

  circlesGroup.on("mouseover",function(d) { 
    toolTip.show(d, this)})
  
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;


}

//for the y axis 
function updateYToolTip(chosenYAxis, circlesGroup) {

  var labelY;

  if (chosenYAxis === "healthcare") {
    labelY = "Healthcare:";
  }
  else if (chosenYAxis === "smokes") {
    labelY = "Smokes:";
  }
  else {
    labelY = "Obesity:";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state},${d.abbr}<br> ${chosenXAxis} : ${d[chosenXAxis]} <br> ${labelY} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  // circlesGroup.on("mouseover", function(data) {
  //   toolTip.show(data);
  // })

  circlesGroup.on("mouseover",function(d) { 
    toolTip.show(d, this)})
  
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//--------------------------------------------------------------------------------------------------------

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(newsData, err) {
  console.log(newsData)
  if (err) throw err;

  // parse data
  newsData.forEach(function(data) {
    data.poverty= +data.poverty;
    data.healthcare= +data.healthcare
    data.age= +data.age;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obsesity = +data.obsesity;


  
  });
//-------------------------------------------------------------------------------------------
  // xLinearScale function above csv import
  var xLinearScale = xScale(newsData, chosenXAxis);

 var yLinearScale = yScale(newsData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0-${width},0 )`)
    .call(leftAxis);

    console.log(yAxis)


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "teal")
    .attr("opacity", ".9");

  //append initial text 
  
  var textGroup = chartGroup.selectAll(null).data(newsData).enter().append("text");

  textGroup
    .attr("x", function(d) {
      return  xLinearScale(d[chosenXAxis])

    })
    .attr("y", function(d) {
      return yLinearScale(d[chosenYAxis]);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white")  

 console.log(textGroup)

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");


  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");


  // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Lacks Healthcare (%) "); 

  var yLabels = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    
  var healthcareLabel = yLabels.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 20 - margin.left)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%) ");

  var smokesLabel = yLabels.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 40 - margin.left)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%) ");

  var obeseLabel = yLabels.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 60 - margin.left)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%) ");

    


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  var circlesGroup = updateYToolTip(chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(newsData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);


        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
         
        }
        else if (chosenXAxis === "income") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
         
        }
        else {
         ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          
        }
        
      }
    });


    //y axis labels event listener
  yLabels.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(newsData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);


        // updates tooltips with new info
        circlesGroup = updateYToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }


        else if (chosenYAxis === "obesity")  {
          smokesLabel
           .classed("active", false)
           .classed("inactive", true);
          healthcareLabel
           .classed("active", false)
           .classed("inactive", true);
          obeseLabel
           .classed("active", true)
           .classed("inactive", false);
         }






        else  {
         smokesLabel
          .classed("active", false)
          .classed("inactive", true);
         healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        }



       
      }
    })  

}).catch(function(error) {
  console.log(error);
});
