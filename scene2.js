// Data URL (replace 'path_to_your_data_file.csv' with the actual path)
const dataURL = "airline-safety.csv";

// Function to draw the bar chart
function drawChart(selectedAirline) {
  // Load the data
  d3.csv(dataURL).then((data) => {
    // Filter data for the selected airline
    const selectedAirlineData = data.find((d) => d.airline === selectedAirline);

    // Check if the selected airline data exists
    if (selectedAirlineData) {
      // Sort the data in descending order of incidents, fatal accidents, and fatalities
      const sortedData = data
        .slice()
        .sort((a, b) => b.incidents_85_99 - a.incidents_85_99);

      // Find the index of the selected airline in the sorted data
      const selectedIndex = sortedData.findIndex(
        (d) => d.airline === selectedAirline
      );

      // Clear previous chart
      d3.select("#chart").selectAll("*").remove();

      // Set up the chart dimensions
      const margin = { top: 40, right: 200, bottom: 100, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create the SVG container
      const svg = d3
        .select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Data for the selected airline
      const airlineData = [
        {
          label: "Incidents",
          value: +selectedAirlineData.incidents_85_99,
          color: "#1f77b4",
        },
        {
          label: "Fatal Accidents",
          value: +selectedAirlineData.fatal_accidents_85_99,
          color: "#ff7f0e",
        },
        {
          label: "Fatalities",
          value: +selectedAirlineData.fatalities_85_99,
          color: "#d62728",
        },
      ];

      // Y scale
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(airlineData, (d) => d.value) + 100])
        .range([height, 0]);

      // X scale
      const xScale = d3
        .scaleBand()
        .domain(airlineData.map((d) => d.label))
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.2);

      // Draw the bars
      svg
        .selectAll(".bar")
        .data(airlineData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.label))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d.value))
        .attr("fill", (d) => d.color)
        .on("mouseover", function (event, d) {
          // Show tooltip on hover
          const tooltip = d3.select("#tooltip");
          tooltip
            .html(`<strong>${d.label}:</strong> ${d.value}`)
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY - 28}px`)
            .style("visibility", "visible");
        })
        .on("mouseout", function () {
          // Hide tooltip when not hovering
          const tooltip = d3.select("#tooltip");
          tooltip.style("visibility", "hidden");
        });

      // Add ranking annotations
      svg
        .selectAll(".rank")
        .data(airlineData)
        .enter()
        .append("text")
        .attr("class", "rank")
        .attr("x", (d) => xScale(d.label) + xScale.bandwidth() / 2)
        .attr("y", (d) => yScale(d.value) - 25)
        .attr("text-anchor", "middle")
        .text((d, i) => `Rank ${selectedIndex + 1 - i}`)
        .style("fill", "gray")
        .style("font-size", "12px");

      // X axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      // Y axis
      svg.append("g").call(d3.axisLeft(yScale));

      // Add a title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .text(`Safety Records for ${selectedAirline} (1985-1999)`);

      // Add a tooltip container
      d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "#f7f7f7")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("visibility", "hidden");
    }
  });
}

// Function to handle the dropdown selection change
function handleDropdownChange() {
  const selectedAirline = d3.select("#airlineSelect").property("value");
  if (selectedAirline) {
    drawChart(selectedAirline);

    // Update the highest data table for the selected airline
    updateHighestData(window.data, 5);
  }
}

// Function to handle the next scene button click
function handleNextSceneClick() {
  // Navigate to the next scene (replace 'scene3.html' with the next scene's HTML file)
  window.location.href = "scene3.html";
}

// Function to update the highest data table
function updateHighestData(data, numRecords) {
  // Sort the data in descending order of incidents, fatal accidents, and fatalities
  const sortedData = data
    .slice()
    .sort((a, b) => b.incidents_85_99 - a.incidents_85_99);

  // Clear previous data in the table
  d3.select("#highestData").selectAll("tr").remove();

  // Add header row
  const headerRow = d3.select("#highestData").append("tr");
  headerRow
    .append("th")
    .text("Airline")
    .attr("style", "border: 1px solid black; padding: 8px;")
    .attr("align", "left");
  headerRow
    .append("th")
    .text("Incidents")
    .attr("style", "border: 1px solid black; padding: 8px;")
    .attr("align", "left");
  headerRow
    .append("th")
    .text("Fatal Accidents")
    .attr("style", "border: 1px solid black; padding: 8px;")
    .attr("align", "left");
  headerRow
    .append("th")
    .text("Fatalities")
    .attr("style", "border: 1px solid black; padding: 8px;")
    .attr("align", "left");

  // Add rows for top airlines
  for (let i = 0; i < numRecords; i++) {
    const row = d3.select("#highestData").append("tr");
    row
      .append("td")
      .text(sortedData[i].airline)
      .attr("style", "border: 1px solid black; padding: 8px;")
      .attr("align", "left");
    row
      .append("td")
      .text(sortedData[i].incidents_85_99)
      .attr("style", "border: 1px solid black; padding: 8px;")
      .attr("align", "left");
    row
      .append("td")
      .text(sortedData[i].fatal_accidents_85_99)
      .attr("style", "border: 1px solid black; padding: 8px;")
      .attr("align", "left");
    row
      .append("td")
      .text(sortedData[i].fatalities_85_99)
      .attr("style", "border: 1px solid black; padding: 8px;")
      .attr("align", "left");
  }
}

// Event listeners
d3.select("#airlineSelect").on("change", handleDropdownChange);
d3.select("#nextSceneButton").on("click", handleNextSceneClick);

// Load the data and populate the dropdown options
d3.csv(dataURL).then((data) => {
  // Save the data in a global variable for later use
  window.data = data;

  const airlines = data.map((d) => d.airline);
  d3.select("#airlineSelect")
    .selectAll("option")
    .data(airlines)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d);

  // Initial call to draw the chart with the default selected airline
  drawChart(airlines[0]);

  // Initial call to update the highest data table with the default selected airline
  updateHighestData(data, 5);
});
