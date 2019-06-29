function createMap(){

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    var chart = am4core.create("chartdiv", am4maps.MapChart);
    var interfaceColors = new am4core.InterfaceColorSet();
    chart.geodata = am4geodata_worldLow;

 // Create map instance;
    // Set map definition
    
    
    // Set projection
    chart.projection = new am4maps.projections.Miller();
    
    // Create map polygon series (creates countries on map)
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.nonScalingStroke = true;

    var lineSeries = chart.series.push(new am4maps.MapLineSeries());
    lineSeries.dataFields.multiGeoLine = "multiGeoLine";

    var lineTemplate = lineSeries.mapLines.template;
    lineTemplate.nonScalingStroke = true;
    lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");
    lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
    lineTemplate.line.strokeOpacity = 1;

    var line_data = [];
    d3.json("/mapyear?year=1960", response => {
      console.log(response[0].originlat);

      
      for (var index = 0; index < response.length; index++){
        line_data.push(
        {
          "multiGeoLine": 
            [[
                {"latitude": response[index].originlat, "longitude": response[index].originlong},
                {"latitude": response[index].destinationlat, "longitude": response[index].destinationlong},
               ]]
        });
      }     } );

      lineSeries.data = line_data;
    //log first year of data? maybethis is the issue that is causing it not to create the map in the first place i don't fucking know
     

    
}
createMap();