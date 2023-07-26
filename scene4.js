const dataURL = "airline-safety.csv";

// Load the data and call the function to draw the scatterplots
d3.csv(dataURL).then((data) => {
  drawScatterplot(data);
});

// Function to draw the scatterplots
function drawScatterplot(data) {
  // Filter data for the top 5 airlines with the highest fatalities in both periods
  const sortedData85_99 = data
    .slice()
    .sort((a, b) => b.fatalities_85_99 - a.fatalities_85_99);
  const top5Airlines85_99 = sortedData85_99.slice(0, 5);

  const sortedData00_14 = data
    .slice()
    .sort((a, b) => b.fatalities_00_14 - a.fatalities_00_14);
  const top5Airlines00_14 = sortedData00_14.slice(0, 5);

  // Set up chart dimensions
  const margin = { top: 50, right: 50, bottom: 100, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create SVG container for fatalities scatterplot
  const svgFatalities = d3
    .select("#fatalitiesScatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create SVG container for incidents scatterplot
  const svgIncidents = d3
    .select("#incidentsScatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Data for the scatterplots
  const fatalitiesData = data.map((d) => ({
    airline: d.airline,
    x: +d.fatalities_85_99,
    y: +d.fatalities_00_14,
  }));

  const incidentsData = data.map((d) => ({
    airline: d.airline,
    x: +d.incidents_85_99,
    y: +d.incidents_00_14,
  }));

  // X scale for fatalities scatterplot
  const xScaleFatalities = d3
    .scaleLinear()
    .domain([0, d3.max(fatalitiesData, (d) => d.x)])
    .nice()
    .range([0, width]);

  // Y scale for fatalities scatterplot
  const yScaleFatalities = d3
    .scaleLinear()
    .domain([0, d3.max(fatalitiesData, (d) => d.y)])
    .nice()
    .range([height, 0]);

  // X scale for incidents scatterplot
  const xScaleIncidents = d3
    .scaleLinear()
    .domain([0, d3.max(incidentsData, (d) => d.x)])
    .nice()
    .range([0, width]);

  // Y scale for incidents scatterplot
  const yScaleIncidents = d3
    .scaleLinear()
    .domain([0, d3.max(incidentsData, (d) => d.y)])
    .nice()
    .range([height, 0]);

  // Draw X and Y axes for fatalities scatterplot
  svgFatalities
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScaleFatalities).ticks(5))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Fatalities (1985-1999)");

  svgFatalities
    .append("g")
    .call(d3.axisLeft(yScaleFatalities).ticks(5))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Fatalities (2000-2014)");

  // Draw X and Y axes for incidents scatterplot
  svgIncidents
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScaleIncidents).ticks(5))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Incidents (1985-1999)");

  svgIncidents
    .append("g")
    .call(d3.axisLeft(yScaleIncidents).ticks(5))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Incidents (2000-2014)");

  // Draw scatterplot points for fatalities
  svgFatalities
    .selectAll(".circle")
    .data(fatalitiesData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", (d) => xScaleFatalities(d.x))
    .attr("cy", (d) => yScaleFatalities(d.y))
    .attr("r", 5)
    .attr("fill", "blue")
    .on("mouseover", function (event, d) {
      // Show tooltip on hover
      const tooltip = d3.select("#tooltip");
      tooltip
        .html(
          `<strong>${d.airline}</strong><br>1985-1999 Fatalities: ${d.x}<br>2000-2014 Fatalities: ${d.y}`
        )
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 28}px`)
        .style("visibility", "visible");
    })
    .on("mouseout", function () {
      // Hide tooltip when not hovering
      const tooltip = d3.select("#tooltip");
      tooltip.style("visibility", "hidden");
    });

  // Draw scatterplot points for incidents
  svgIncidents
    .selectAll(".circle")
    .data(incidentsData)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", (d) => xScaleIncidents(d.x))
    .attr("cy", (d) => yScaleIncidents(d.y))
    .attr("r", 5)
    .attr("fill", "orange")
    .on("mouseover", function (event, d) {
      // Show tooltip on hover
      const tooltip = d3.select("#tooltip");
      tooltip
        .html(
          `<strong>${d.airline}</strong><br>1985-1999 Incidents: ${d.x}<br>2000-2014 Incidents: ${d.y}`
        )
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 28}px`)
        .style("visibility", "visible");
    })
    .on("mouseout", function () {
      // Hide tooltip when not hovering
      const tooltip = d3.select("#tooltip");
      tooltip.style("visibility", "hidden");
    });

  // Calculate the regression coefficients (m and b)
  const regressionCoefficientsFatalities =
    calculateRegressionCoefficients(fatalitiesData);
  const regressionCoefficientsIncidents =
    calculateRegressionCoefficients(incidentsData);
  let showRegressionLines = false;

  function drawRegressionLines() {
    if (showRegressionLines) {
      svgFatalities.select(".regression-line").style("display", "block");

      svgIncidents.select(".regression-line").style("display", "block");
    } else {
      svgFatalities.select(".regression-line").style("display", "none");

      svgIncidents.select(".regression-line").style("display", "none");
    }
  }

  // Create a line generator for the regression lines
  const lineGeneratorFatalities = d3
    .line()
    .x((d) => xScaleFatalities(d.x))
    .y((d) =>
      yScaleFatalities(
        regressionCoefficientsFatalities.m * d.x +
          regressionCoefficientsFatalities.b
      )
    );

  const lineGeneratorIncidents = d3
    .line()
    .x((d) => xScaleIncidents(d.x))
    .y((d) =>
      yScaleIncidents(
        regressionCoefficientsIncidents.m * d.x +
          regressionCoefficientsIncidents.b
      )
    );

  // Draw the regression lines for fatalities and incidents (initially hidden)
  svgFatalities
    .append("path")
    .datum(fatalitiesData)
    .attr("class", "regression-line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", lineGeneratorFatalities)
    .style("display", "none");

  svgIncidents
    .append("path")
    .datum(incidentsData)
    .attr("class", "regression-line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", lineGeneratorIncidents)
    .style("display", "none");

  // Add labels for outlier points
  const outliersFatalities = getOutliers(fatalitiesData);
  const outliersIncidents = getOutliers(incidentsData);

  svgFatalities
    .selectAll(".outlier-label")
    .data(outliersFatalities)
    .enter()
    .append("text")
    .attr("class", "outlier-label")
    .attr("x", (d) => xScaleFatalities(d.x) + 8)
    .attr("y", (d) => yScaleFatalities(d.y))
    .text((d) => d.airline)
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("alignment-baseline", "middle");

  svgIncidents
    .selectAll(".outlier-label")
    .data(outliersIncidents)
    .enter()
    .append("text")
    .attr("class", "outlier-label")
    .attr("x", (d) => xScaleIncidents(d.x) + 8)
    .attr("y", (d) => yScaleIncidents(d.y))
    .text((d) => d.airline)
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("alignment-baseline", "middle");

  const toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", function () {
    showRegressionLines = !showRegressionLines;
    drawRegressionLines();
  });
}
function getOutliers(data) {
  // Calculate the first quartile (Q1) and third quartile (Q3)
  const sortedData = data.slice().sort((a, b) => a.y - b.y);
  const n = sortedData.length;
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = sortedData[q1Index].y;
  const q3 = sortedData[q3Index].y;

  // Calculate the interquartile range (IQR)
  const iqr = q3 - q1;

  // Calculate the lower and upper bounds for outliers
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  // Filter the data to get outliers
  return data.filter((d) => d.y < lowerBound || d.y > upperBound);
}

function calculateRegressionCoefficients(data) {
  // Calculate the means of x and y
  const meanX = d3.mean(data, (d) => d.x);
  const meanY = d3.mean(data, (d) => d.y);

  // Calculate the differences between each x and the mean x, and each y and the mean y
  const diffX = data.map((d) => d.x - meanX);
  const diffY = data.map((d) => d.y - meanY);

  // Calculate the sum of the product of differences
  const sumDiffXY = d3.sum(diffX.map((d, i) => d * diffY[i]));

  // Calculate the sum of the squared differences for x
  const sumDiffXSquare = d3.sum(diffX.map((d) => d * d));

  // Calculate the regression coefficient (m)
  const m = sumDiffXY / sumDiffXSquare;

  // Calculate the y-intercept (b)
  const b = meanY - m * meanX;

  return { m, b };
}
