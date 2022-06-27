function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var metadata = data.metadata;
    var samples = data.samples;
   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var metaSample = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleSample = samples.filter(sampleObj => sampleObj.id == sample)[0];
    var otuIds = sampleSample.otu_ids;
    var otuLabels = sampleSample.otu_labels;
    var sampleValues = sampleSample.sample_values;

    //Create a variable that holds the washing frequency
    var washFreq = metaSample.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    //test = otuID;
    //console.log(samples);
    var yticks = otuIds.slice(0,10).map(tick => "OTD " + tick).reverse();
  
  
    // 8. Create the trace for the bar chart. 
    var barData = [
        {
          y: yticks,
          x: sampleValues.slice(0,10).reverse(),
          type: 'bar',
          orientation: 'h',
          hover_data: otuLabels
        }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     height: 600,
     width: 500,
     paper_bgcolor: 'rgba(0,0,0,0)',
     plot_bgcolor: 'rgba(0,0,0,0)'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Earth',
        }
      }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: {title: 'OTU ID'},
      hovermode: 'closest',
      height: 500,
      width: 1000,
      paper_bgcolor: 'rgba(0,0,0,0)',
      padding: 0
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

 // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: washFreq,
        title: { text: "Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10] },
            bar: {color: "black" },
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "limegreen" },
              { range: [8, 10], color: "green"}
            ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: {
        text: '<b>Belly Button Washing Frequency</b>',
      },
      height: 500,
      width: 600,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}

