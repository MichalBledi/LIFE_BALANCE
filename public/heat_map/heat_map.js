async function fetchDataAndPlotMap() {
    try {
        // Fetch obesity data for 'Both' gender in 2016
        const response = await fetch('/api/bmi-data/2016'); // Fetching for year 2016
        const data = await response.json();

        // Extract the data for 'Both' gender
        const bothSexesData = data.bothSexes;

        // Extract necessary fields for the map
        const countries = bothSexesData.map(entry => entry.country);
        const bmiValues = bothSexesData.map(entry => entry.bmi);

        // Now you can use `countries` and `bmiValues` for your map
        console.log(countries, bmiValues);

        /*
        // Fetch obesity data from the server
        const response = await fetch('/api/global-bmi-data');
        const data = await response.json();

        // Extract necessary fields for the map
        const countries = data.map(entry => entry.country);
        const obesityRates = data.map(entry => entry.obesity_rate);
        
        
        // Prepare Plotly data
        const plotData = [{
            type: 'choropleth',
            locationmode: 'country names',
            locations: countries,
            z: obesityRates,
            //text: countries,
            colorscale: 'Reds',
            colorbar: { title: 'Obesity Rates (%)' },
        }];
        */

        // Prepare Plotly data
        const plotData = [{
            type: 'choropleth',
            locationmode: 'country names',
            locations: countries,
            z: bmiValues,
            //text: countries,
            colorscale: 'Reds',
            colorbar: { title: 'Obesity Rates (%)' },
        }];

        // Layout settings for the globe heatmap
        const layout = {
            title: 'Global Obesity Heatmap',
            geo: {
                projection: {
                    type: 'orthographic', // Globe-like projection
                },
                showcoastlines: true,
                coastlinecolor: 'gray',
                showland: true,
                landcolor: 'lightgray',
                oceancolor: '#a4c0e9',
                showocean: true,
            },
        };

        // Render the map
        Plotly.newPlot('heatmap', plotData, layout);
    } catch (error) {
        console.error('Error fetching or rendering data:', error);
    }
}

// Initialize the map
fetchDataAndPlotMap();