function createMap(){


  var chart = am4core.create("chartdiv", am4maps.MapChart);
  var interfaceColors = new am4core.InterfaceColorSet();

  var title = chart.titles.create();
  title.text = "[bold font-size: 20]Movement of Refugees and Asylum Seekers 1960-2017[/]\nSource: UNHCR";
  title.textAlign = "middle";
  var label = chart.chartContainer.createChild(am4core.Label);
  label.align = "bottom";
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create map instance;
    // Set map definition
    chart.geodata = am4geodata_worldLow;
    
    // Set projection
    chart.projection = new am4maps.projections.Miller();
    
    // Create map polygon series (creates countries on map)
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;
    polygonSeries.nonScalingStroke = true;
    polygonSeries.strokeWidth = 0.5;

    var conflictSeries = chart.series.push(new am4maps.MapPolygonSeries());
    conflictSeries.heatRules.push({
      property: "fill",
      target: conflictSeries.mapPolygons.template,
      max: am4core.color("#e60000"),
      min: am4core.color("#ffa366")
    });
    conflictSeries.useGeodata = true;


    // Set up heat legend
    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = conflictSeries;
    heatLegend.align = "right";
    heatLegend.valign = "bottom";
    heatLegend.width = am4core.percent(20);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 750000;

    // Set up custom heat map legend labels using axis ranges
    var minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "0";
    var maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "750000";

    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
      return "";
    });

    // Configure series tooltip
    var polygonTemplate = conflictSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: Total Deaths {value}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");

    //create line series - with arrows showing origin to desination 
    var lineSeries = chart.series.push(new am4maps.MapLineSeries());
    lineSeries.dataFields.multiGeoLine = "multiGeoLine";
    lineSeries.dataFields.id = "id"; //will hold origin to destination
    lineSeries.dataFields.value = "value"; // will hold # of refugees
    
    var lineTemplate = lineSeries.mapLines.template;
    lineTemplate.tooltipText = "{id}: Total Refugees {value}";
    lineTemplate.nonScalingStroke = true;
    lineTemplate.arrow.nonScaling = true;
    lineTemplate.arrow.width = 4;
    lineTemplate.arrow.height = 6;
    
    lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");
    lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
    lineTemplate.line.strokeOpacity = .5;

    //log first year of data? maybethis is the issue that is causing it not to create the map in the first place i don't fucking know
//     lineSeries.data = 
//     [{
//       "multiGeoLine": 
//         [[ {"latitude": 47.33333333, "longitude": 13.33333333},
//             {"latitude": 42.666667, "longitude":21.166667 } ]]},
//     {
//           "multiGeoLine": 
//             [[ {"latitude":50.83333333 , "longitude": 4.0},
//                 {"latitude": 42.666667, "longitude": 21.166667} ]]},
//     {
//           "multiGeoLine": 
//             [[ {"latitude": 60.0, "longitude":-95.0 },
//                 {"latitude":42.666667 , "longitude":21.166667 } ]]},
// {
//       "multiGeoLine": 
//         [[ {"latitude": 47.0, "longitude":8.0 },
//             {"latitude":42.666667 , "longitude":21.166667 } ]]},
//             {
//               "multiGeoLine": 
//                 [[ {"latitude":0.0 , "longitude":25.0 },
//                     {"latitude": -12.5, "longitude":18.5 } ]]},
//                     {
//                       "multiGeoLine": 
//                         [[ {"latitude":51.0 , "longitude":9.0 },
//                             {"latitude": 42.666667, "longitude": 21.166667} ]]},

//           {
//       "multiGeoLine": 
//         [[ {"latitude":56.0 , "longitude":0.0 },
//             {"latitude":42.666667 , "longitude": 21.166667} ]]},
//             {
//               "multiGeoLine": 
//                 [[ {"latitude": 46.0, "longitude": 2.0},
//                     {"latitude": 42.666667, "longitude": 21.166667} ]]},
//                     {
//       "multiGeoLine": 
//         [[ {"latitude": 54.0, "longitude":-2.0 },
//             {"latitude": 42.666667, "longitude": 21.166667} ]]},
//             {
//       "multiGeoLine": 
//         [[ {"latitude":39.0 , "longitude":22.0 },
//             {"latitude": 42.666667, "longitude": 21.166667} ]]},
//             {
//       "multiGeoLine": 
//         [[ {"latitude": 42.83333333, "longitude":12.83333333 },
//             {"latitude":42.666667 , "longitude": 21.166667} ]]},
//             {
//       "multiGeoLine": 
//         [[ {"latitude": 49.75, "longitude": 6.16666666},
//             {"latitude":42.666667 , "longitude":21.166667 } ]]},
//             {
//       "multiGeoLine": 
//         [[ {"latitude": 32.0, "longitude": -5.0},
//             {"latitude": 42.666667, "longitude":21.166667 } ]]},
//             {
//       "multiGeoLine": 
//         [[ {"latitude": 52.5, "longitude": 5.75},
//             {"latitude": 42.666667, "longitude":21.166667} ]]},
//             {
//       "multiGeoLine": 
//         [[ {"latitude": 62.0, "longitude":10.0 },
//         {"latitude": 42.666667, "longitude":21.166667} ]]},
//         {
//       "multiGeoLine": 
//         [[ {"latitude": 62.0, "longitude":15.0 },
//         {"latitude": 42.666667, "longitude":21.166667} ]]},
//         {
//       "multiGeoLine": 
//         [[ {"latitude": 34.0, "longitude":9.0 },
//         {"latitude": 42.666667, "longitude":21.166667} ]]},
//         {
//       "multiGeoLine": 
//         [[ {"latitude": 39.0, "longitude":35.0 },
//         {"latitude": 42.666667, "longitude":21.166667} ]]},
//         {
//       "multiGeoLine": 
//         [[ {"latitude": 38.0, "longitude":-97.0 },
//         {"latitude": 42.666667, "longitude":21.166667} ]]}
//         ];
    
    
    //Create slider that changes between iterations of year/map
    var slider = chart.createChild(am4core.Slider);
    slider.padding(0, 15, 0, 60);
    slider.background.padding(0, 15, 0, 60);
    slider.marginBottom = 15;
    slider.valign = "bottom";
  
    
    var currentIndex = 1960;
    
    var year_set = [1961,	1962,	1963,	1964,	1965,	1966,	1967,	1968,	1969,	1970,	1971,	1972,	
      1973,	1974,	1975,	1976,	1977,	1978,	1979,	1980,	1981,	1982,	1983,	1984,	1985,	1986,	1987,	1988,	
      1989,	1990,	1991,	1992,	1993,	1994,	1995,	1996,	1997,	1998,	1999,	2000,	2001,	2002,	2003,	2004,	2005,	
      2006,	2007,	2008,	2009,	2010,	2011,	2012,	2013,	2014,	2015,	2016,	2017];
    
    setInterval(function () {
      var next = slider.start + 1 / year_set.length;
      if (next >= 1) {
        next = 0;
      }
    slider.animate({ property: "start", to: next }, 300);
     }, 5000)
    
    slider.events.on("rangechanged", function () {
      changeYear();
      console.log(slider.start);
    })
    
    //function creates graph > nest line and heat map creation here.
    function changeYear() {
      var total_time = year_set.length - 1;
      var yearIndex = year_set[Math.round(total_time * slider.start)];
      console.log(year_set.length);
      
      label.text = "";
      label.text = `${yearIndex}`;
      label.fontSize = 64;

      if (currentIndex != yearIndex) {
        
        var url1 = `/conflictyear?year=${yearIndex}`
        var url2 = `/mapyear?year=${yearIndex}`

        d3.json(url1, response => {
          var heat_data = [];
          for (var index = 0; index < response.length; index++){
            heat_data.push(
              response[index]
            );
          } 
          conflictSeries.data = heat_data;
          conflictSeries.invalidateData();
        });
        


        //load data with d3 json request - use format below Origin>Destination
        d3.json(url2, response => {
        console.log(response[0].originlat);

        var line_data = [];
        for (var index = 0; index < response.length; index++){
          line_data.push(
          { "id":response[index].id,
              "value":response[index].value,
            "multiGeoLine": 
              [[
                  {"latitude": response[index].originlat, "longitude": response[index].originlong},
                  {"latitude": response[index].destinationlat, "longitude": response[index].destinationlong},
                 ]]
          });
        }      

        lineSeries.data = line_data;
        lineSeries.invalidateData();
        //chart.animateAgain();
        console.log(lineSeries);
        
        
      })

    } 
    currentIndex = yearIndex;
  } // end am4core.ready()
}
createMap();