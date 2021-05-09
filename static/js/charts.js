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
    /////////////////////////////////////////////////////////////////////
    // ------------------------------------------------------------------
    // ------------------ Bar Chart -------------------------------------
    // ------------------------------------------------------------------
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object 
    // with the desired sample number.
    // var samplesResultArray = samples.filter(sampleObj => sampleObj.id == sample)[0];

    //  5. Create a variable that holds the first sample in the array.
    // var sampleResult = samplesResultArray[0];

    // Combining steps 4 and 5 into a single line of code
    var sampleResult = samples.filter(sampleObj => sampleObj.id == sample)[0];
    // console.log(sampleResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids;
    var otu_labels = sampleResult.otu_labels;
    var sample_values = sampleResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    var sortedSamples = sample_values.slice(0,10).reverse();
    var sortedIds = otu_ids.slice(0,10).reverse();
    var yticks = sortedIds.map(a => "OTU " + a);
    // console.log(sortedSamples);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sortedSamples,
      y: yticks,
      type: "bar",
      orientation: "h"
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Cultures Found"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // ------------------------------------------------------------------
    // ------------------ Bar Chart -------------------------------------
    // ------------------------------------------------------------------

    /////////////////////////////////////////////////////////////////////
    
    // ------------------------------------------------------------------
    // ------------------ Bubble Chart ----------------------------------
    // ------------------------------------------------------------------

    // 1. Create the trace for the bubble chart.
    // Normalize the sample data and size the bubbles based on the size
    // Choose colors in a similar way

    // var max_sample_values = Math.max(parseInt(sample_values));
    // console.log(sample_values.map(value => value/max_sample_values*200));
    // console.log(max_sample_values);

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // ------------------------------------------------------------------
    // ------------------ Bubble Chart ----------------------------------
    // ------------------------------------------------------------------

    /////////////////////////////////////////////////////////////////////

    // ------------------------------------------------------------------
    // ------------------ Gauge Chart -----------------------------------
    // ------------------------------------------------------------------

    // 4. Create the trace for the gauge chart.
    var washFreq = parseFloat(data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq);
    // console.log(washFreq);

    var titleText1 = "Belly Button Washing Frequency";
    var titleText2 = "Scrubs per Week";

    var gaugeData = [
      {
        domain: {x: [0,1], y: [0,1]},
        value: washFreq,
        type: "indicator",
        mode: "gauge+number",
        title: {
          text: titleText1.bold() + "<br>" + titleText2
        },
        gauge: {
          axis: {range: [0, 10], nticks: 6},
          nticks: 6,
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "yellowgreen"},
            {range: [8,10], color: "darkgreen"}
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      // width: 450,
      // height: 350,
      autosize: true,
      margin: {t: 0, b: 0, l: 25, r: 25},
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    // ------------------------------------------------------------------
    // ------------------ Gauge Chart -----------------------------------
    // ------------------------------------------------------------------

  });
}
