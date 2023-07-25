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
      // Clear previous chart
      d3.select("#chart").selectAll("*").remove();

      // Set up the chart dimensions
      const margin = { top: 40, right: 20, bottom: 100, left: 60 };
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
          value: +selectedAirlineData.incidents_85_99, // Convert to a number using '+'
          color: "#1f77b4",
        },
        {
          label: "Fatal Accidents",
          value: +selectedAirlineData.fatal_accidents_85_99, // Convert to a number using '+'
          color: "#ff7f0e",
        },
        {
          label: "Fatalities",
          value: +selectedAirlineData.fatalities_85_99, // Convert to a number using '+'
          color: "#d62728",
        },
      ];

      // Y scale
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(airlineData, (d) => d.value) + 100]) // Adjust the y-axis domain with some padding
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
  }
}

// Function to handle the next scene button click
function handleNextSceneClick() {
  // Navigate to the next scene (replace 'scene3.html' with the next scene's HTML file)
  window.location.href = "scene3.html";
}

// Event listeners
d3.select("#airlineSelect").on("change", handleDropdownChange);
d3.select("#nextSceneButton").on("click", handleNextSceneClick);

// Load the data and populate the dropdown options
d3.csv(dataURL).then((data) => {
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
});
