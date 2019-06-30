function renderChart(sample) {
    // var url = `/refugeeDataByRegion`
    var url = `/refugeeDataByRegion?country_name=${sample}`
    console.log("fetching data")
    // Themes begin
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv", am4charts.XYChart);

    // Use `d3.json` to fetch the metadata for a sample
    d3.json(url).then(function (data) {
        data.forEach((d) => d.year = d.year + "")
        console.log(data)

        chart.data = data;

        chart.dateFormatter.inputDateFormat = "yyyy";
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 60;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.baseInterval = {
            timeUnit: "year",
            count: 1
        }
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;

        var series3 = chart.series.push(new am4charts.LineSeries());
        series3.name = "asylum_seekers";
        series3.dataFields.dateX = "year";
        series3.dataFields.valueY = "asylum_seekers";
        // series3.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/bicycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
        series3.tooltipText = "[#000]{valueY.value}[/]";
        series3.tooltip.background.fill = am4core.color("#FFF");
        series3.tooltip.getFillFromObject = false;
        series3.tooltip.getStrokeFromObject = true;
        series3.tooltip.background.strokeWidth = 3;
        series3.sequencedInterpolation = true;
        // series3.fillOpacity = 0.6;
        series3.defaultState.transitionDuration = 1000;
        series3.stacked = false;
        series3.strokeWidth = 2;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.scrollbarX = new am4core.Scrollbar();


        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "year";
        series.name = "idp";
        series.dataFields.valueY = "idp";
        // series.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/car.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
        series.tooltipText = "[#000]{valueY.value}[/]";
        series.tooltip.background.fill = am4core.color("#FFF");
        series.tooltip.getStrokeFromObject = true;
        series.tooltip.background.strokeWidth = 3;
        series.tooltip.getFillFromObject = false;
        // series.fillOpacity = 0.6;
        series.strokeWidth = 2;
        series.stacked = false;

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.name = "refugees";
        series2.dataFields.dateX = "year";
        series2.dataFields.valueY = "refugees";
        // series2.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/motorcycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
        series2.tooltipText = "[#000]{valueY.value}[/]";
        series2.tooltip.background.fill = am4core.color("#FFF");
        series2.tooltip.getFillFromObject = false;
        series2.tooltip.getStrokeFromObject = true;
        series2.tooltip.background.strokeWidth = 3;
        series2.sequencedInterpolation = true;
        // series2.fillOpacity = 0.6;
        series2.stacked = false;
        series2.strokeWidth = 2;

        // Add a legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";
    });

}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selectCountry");

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
        renderChart(firstSample);
    });
}

function countryOnChange(country) {
    // Fetch new data each time a new sample is selected

    renderChart(country);
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize the dashboard
    init();
})

