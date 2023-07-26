// Scene 1: Introduction

// Function to create the overview of the dataset and its variables
function createOverview() {
  const overviewContainer = d3.select(".overview");

  const overviewText = `Welcome to the Airline Safety Narrative Visualization. This interactive web page aims to explore the safety records of different airlines based on incidents and accidents that occurred during two time periods: 1985-1999 and 2000-2014. It aims to answer if there is a <strong> correlation between airline and crash / incident risk.</strong>`;

  const datasetVariables = [
    "airline: Airline name (asterisk indicates that regional subsidiaries are included)",
    "avail_seat_km_per_week: Available seat kilometers flown every week",
    "incidents_85_99: Total number of incidents, 1985–1999",
    "fatal_accidents_85_99: Total number of fatal accidents, 1985–1999",
    "fatalities_85_99: Total number of fatalities, 1985–1999",
    "incidents_00_14: Total number of incidents, 2000–2014",
    "fatal_accidents_00_14: Total number of fatal accidents, 2000–2014",
    "fatalities_00_14: Total number of fatalities, 2000–2014",
  ];

  overviewContainer.append("p").html(overviewText);

  overviewContainer
    .append("p")
    .text("The dataset contains the following variables:")
    .append("ul")
    .selectAll("li")
    .data(datasetVariables)
    .enter()
    .append("li")
    .html((d) => d);

  overviewContainer
    .append("p")
    .html(
      `Data Source: This data is taken from / references the <a href="https://github.com/fivethirtyeight/data/blob/master/airline-safety/airline-safety.csv" target="_blank" rel="noopener">following dataset</a>`
    );
}

// Call the function to create the overview when the document is loaded
document.addEventListener("DOMContentLoaded", createOverview);
