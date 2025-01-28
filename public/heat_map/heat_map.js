const yearSelect = document.getElementById("year");
const genderSelect = document.getElementById("gender");
const heatmapDiv = document.getElementById("heatmap");

// Populate year dropdown
for (let year = 1975; year <= 2016; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

// Fetch data and render heatmap
async function fetchAndRender(year, gender) {
  try {
    const response = await fetch(`/api/bmi/heatmap?year=${year}&gender=${gender}`);
    const data = await response.json();

    // Extract locations and BMI data
    const countries = data.map((row) => row.country);
    const bmiValues = data.map((row) => row.avg_bmi);

    // Plotly data for the heatmap
    const plotData = [{
      type: 'choropleth',
      locationmode: 'country names',
      locations: countries,
      z: bmiValues,
      colorscale: 'Reds',
      colorbar: { title: 'BMI Value' },
    }];

    // Layout for the map
    const layout = {
      title: `Global BMI Heatmap (${year})`,
      geo: {
        projection: { type: 'orthographic' },
        showcoastlines: true,
        coastlinecolor: 'gray',
        showland: true,
        landcolor: 'lightgray',
        oceancolor: '#FFFFFF',
        showocean: true,
      },
    };

    Plotly.newPlot('heatmap', plotData, layout, { displayModeBar: false });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
  }
}

// Add event listeners for filters
yearSelect.addEventListener("change", () => {
  fetchAndRender(yearSelect.value, genderSelect.value);
});

genderSelect.addEventListener("change", () => {
  fetchAndRender(yearSelect.value, genderSelect.value);
});

// Initial render
fetchAndRender(1975, "Both");
