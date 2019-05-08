function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  d3.json('/metadata/'+sample).then(function(response) {
    console.log();
      d3.select('#sample-metadata').html("");
      Object.entries(response).forEach(([key, value]) => {
        d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
    d3.json('/samples/'+sample).then(function(response) {
    var bubTrace = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      marker: {
        color:response.otu_ids,
        size:response.sample_values
      },
      text: response.otu_labels,
    };
    var bubData = [bubTrace];
    var bubLayout = {
      title: 'Belly Button Biodiversity',
      showlegend: false,
    };
    Plotly.newPlot("bubble", bubData, bubLayout);
    var slcVals = response.sample_values.slice(0, 10);
    var slcIDs = response.otu_ids.slice(0, 10);
    var slcLabels = response.otu_labels.slice(0, 10);
    slcVals.sort(function compareFunction(firstNum, secondNum) {
      return secondNum - firstNum;});
    slcIDs.sort(function compareFunction(firstNum, secondNum) {
      return secondNum - firstNum;});
    slcLabels.sort(function compareFunction(firstNum, secondNum) {
      return secondNum - firstNum;});                 
    var pieTrace = {
      labels: slcIDs,
      values: slcVals,
      textinfo: slcLabels,
      type: "pie"}
    var pieData = [pieTrace];
    var pieLayout = {
    title: "Belly Button Biodiversity Pie Chart",
    };
    Plotly.newPlot("pie", pieData, pieLayout);

});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
