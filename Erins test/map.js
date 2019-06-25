am4core.ready(function() {
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // years
    var startyear = 1951
    var endyear = 2017
    var millyear = 1982
    var syriayear = 2015
    
    var colorSet = new am4core.ColorSet();
    var currentTime;
    
    var container = am4core.create("chartdiv", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    
    // map chart ////////////////////////////////////////////////////////
    var mapChart = container.createChild(am4maps.MapChart);
    mapChart.mouseWheelBehavior = "none";
    
        //js with world country information 
    try {
        mapChart.geodata = am4geodata_worldLow;
    }
    catch (e) {
        mapChart.raiseCriticalError({
            "message": "Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."
        });
    }
    
    //this is the base map
    mapChart.projection = new am4maps.projections.Miller();
    mapChart.deltaLongitude = 0;
    mapChart.seriesContainer.draggable = true;
    
    //drawing polygons for countries
    var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.fill = am4core.color("#3b3b3b");
    polygonSeries.mapPolygons.template.strokeOpacity = 10;
    polygonSeries.exclude = ["Antarctica"];
    

    // create markers for all Origins and Destinations? 

    var mapImageSeries = mapChart.series.push(new am4maps.MapImageSeries());
    var pyongyang = mapImageSeries.mapImages.create();
    pyongyang.longitude = 125.739708;
    pyongyang.latitude = 39.034333;
    pyongyang.nonScaling = true;
    
    var pyongyangCircle = pyongyang.createChild(am4core.Circle);
    pyongyangCircle.fill = colorSet.getIndex(5);
    pyongyangCircle.stroke = pyongyangCircle.fill;
    pyongyangCircle.radius = 4;
    
    pyongyangCircle.tooltip = new am4core.Tooltip();
    pyongyangCircle.tooltip.filters.clear();
    pyongyangCircle.tooltip.background.cornerRadius = 20;
    pyongyangCircle.tooltip.label.padding(15, 20, 15, 20);
    pyongyangCircle.tooltip.background.strokeOpacity = 0;
    pyongyangCircle.tooltipY = -5;
    
    
    var koreaText = pyongyang.createChild(am4core.Label);
    koreaText.text = "North Korea";
    koreaText.fillOpacity = 0.2;
    koreaText.fontSize = 20;
    koreaText.fill = am4core.color("#ffffff");
    koreaText.verticalCenter = "middle";
    koreaText.horizontalCenter = "right";
    koreaText.paddingRight = 15;
    
    var bomb = mapImageSeries.mapImages.create();
    bomb.longitude = 125.739708;
    bomb.latitude = 39.034333;
    bomb.nonScaling = true;
    bomb.opacity = 0;
    
    var bombImage = bomb.createChild(am4core.Image);
    bombImage.width = 32;
    bombImage.height = 32;
    bombImage.href = "//www.amcharts.com/wp-content/uploads/2018/11/rocket.png";
    bombImage.verticalCenter = "middle";
    bombImage.horizontalCenter = "middle";
    
    
    var honolulu = mapImageSeries.mapImages.create();
    honolulu.longitude = -157.887841;
    honolulu.latitude = 21.368213;
    honolulu.nonScaling = true;
    
    
    var bulletAlertCircle = honolulu.createChild(am4core.Circle);
    bulletAlertCircle.fill = am4core.color();
    bulletAlertCircle.stroke = colorSet.getIndex(2);
    bulletAlertCircle.strokeOpacity = 1;
    bulletAlertCircle.radius = 5;
    bulletAlertCircle.strokeWidth = 2;
    bulletAlertCircle.visible = false;
    var bulletAlertAnimation = bulletAlertCircle.animate([{ property: "radius", to: 50 }, { property: "strokeOpacity", to: 0, from: 1 }], 600).loop().pause();
    
    var honoluluCircle = honolulu.createChild(am4core.Circle);
    honoluluCircle.fill = colorSet.getIndex(2);
    honoluluCircle.stroke = honoluluCircle.fill;
    honoluluCircle.radius = 4;
    honoluluCircle.tooltipY = -5;
    
    honoluluCircle.tooltip = new am4core.Tooltip();
    honoluluCircle.tooltip.filters.clear();
    honoluluCircle.tooltip.background.cornerRadius = 20;
    honoluluCircle.tooltip.label.padding(15, 20, 15, 20);
    honoluluCircle.tooltip.background.strokeOpacity = 0;
    
    
    var hawaiiText = honolulu.createChild(am4core.Label);
    hawaiiText.text = "Hawaii, USA";
    hawaiiText.fillOpacity = 0.1;
    hawaiiText.fontSize = 35;
    hawaiiText.fill = am4core.color("#ffffff");
    hawaiiText.verticalCenter = "middle";
    hawaiiText.paddingLeft = 30;
    
    
    var bang = mapImageSeries.mapImages.create();
    bang.longitude = -177;
    bang.latitude = 24;
    bang.nonScaling = true;
    var bangImage = bang.createChild(am4core.Image);
    bangImage.width = 50;
    bangImage.height = 50;
    bangImage.verticalCenter = "middle";
    bangImage.horizontalCenter = "middle";
    bangImage.href = "https://www.amcharts.com/wp-content/uploads/2018/11/bang.png";
    bang.opacity = 0;
    
    var mapLineSeries = mapChart.series.push(new am4maps.MapLineSeries());
    var line = mapLineSeries.mapLines.create();
    line.imagesToConnect = [pyongyang, bang];
    line.line.strokeOpacity = 0; // it's invisible, we use it for a bomb image to follow it
    
    //the homepoints for the map 
    mapChart.homeGeoPoint = { longitude: 0, latitude: 0 };
    mapChart.homeZoomLevel = 1;
    
   
   
    
    // updates all elements
    function setTime() {
        var time = new Date(startTime + (endTime - startTime) * slider.start).getTime();;
        var roundedTime = am4core.time.round(new Date(time), "minute").getTime();
    
        if (roundedTime != currentTime) {
            currentTime = roundedTime;
            var count = lineSeries.dataItems.length;
            if (slider) {
                for (var i = 0; i < count; i++) {
                    var dataItem = lineSeries.dataItems.getIndex(i);
    
                    if (i < slider.start * count) {
                        dataItem.show(500, 0, ["valueY"]);
                    }
                    else {
                        dataItem.hide(500, 0, 0, ["valueY"]);
                    }
                }
            }
        }
    
        }
    
    
    var chart = container.createChild(am4charts.XYChart);
    chart.padding(0, 50, 50, 50);
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.tooltip.background.pointerLength = 4;
    dateAxis.tooltip.background.fillOpacity = 1;
    dateAxis.tooltip.background.fill = am4core.color("#666666");
    dateAxis.tooltip.background.stroke = dateAxis.tooltip.background.fill;
    
    
    chart.height = 300;
    chart.valign = "bottom";
    
    var gradientFill = new am4core.LinearGradient();
    gradientFill.addColor(am4core.color("#000000"), 0, 0);
    gradientFill.addColor(am4core.color("#000000"), 1, 1);
    gradientFill.rotation = 90;
    
    chart.background.fill = gradientFill;
    
    //dateAxis.renderer.inside = true;
    dateAxis.renderer.ticks.template.disabled = true;
    dateAxis.renderer.grid.template.strokeDasharray = "3,3";
    dateAxis.renderer.grid.template.strokeOpacity = 0.2;
    dateAxis.renderer.line.disabled = true;
    dateAxis.tooltip.dateFormatter.dateFormat = "YYYY";
    dateAxis.renderer.inside = false;
    dateAxis.renderer.labels.template.fillOpacity = 0.4;
    dateAxis.renderer.minLabelPosition = 0.03;
    dateAxis.renderer.labels.template.fill = am4core.color("#ffffff");
    dateAxis.renderer.grid.template.stroke = am4core.color("#ffffff");
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.max = 80000000;
    valueAxis.renderer.minGridDistance = 250000;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.line.disabled = true;
    valueAxis.tooltip.disabled = true;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.4;
    valueAxis.renderer.labels.template.fill = am4core.color("#ffffff");
    valueAxis.renderer.grid.template.stroke = am4core.color("#ffffff");
    valueAxis.renderer.inside = true;
    
    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "value";
    lineSeries.dataFields.dateX = "time";
    lineSeries.tooltipText = "{valueY.workingValue}%";
    lineSeries.stroke = am4core.color("#3f2698");
    lineSeries.tooltip.background.fillOpacity = 0;
    lineSeries.tooltip.autoTextColor = false;
    lineSeries.tooltip.label.fill = am4core.color("#ffffff");
    lineSeries.tooltip.filters.clear();
    lineSeries.tooltip.pointerOrientation = "vertical";
    lineSeries.strokeWidth = 2;
    lineSeries.tensionX = 0.7;
    
    var negativeRange = valueAxis.createSeriesRange(lineSeries);
    negativeRange.value = 0;
    negativeRange.endValue = - 100;
    negativeRange.contents.stroke = am4core.color("#84279a");
    negativeRange.contents.fill = negativeRange.contents.stroke;
    
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
    
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "none";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;
    
    chart.events.on("ready", function () {
        createSlider();
    })
    
    var slider;

    //create different ticks on the chart at the bottom
    
    var million_refugees = dateAxis.axisRanges.create();
    million_refugees.date = new Date(millyear);
    million_refugees.grid.stroke = am4core.color("#ffffff");
    million_refugees.grid.strokeWidth = 1;
    million_refugees.grid.strokeOpacity = 0.5;
    million_refugees.grid.strokeDasharray = undefined;
    million_refugees.label.text = "Refugee Population Crosses 1 Million";
    million_refugees.label.horizontalCenter = "right";
    million_refugees.label.fillOpacity = 0.7;
    million_refugees.label.dy = -215;
    million_refugees.label.fill = am4core.color("#FFFFFF");
    
    var syria_crisis = dateAxis.axisRanges.create();
    syria_crisis.date = new Date(syriayear);
    syria_crisis.grid.stroke = am4core.color("#ffffff");
    syria_crisis.grid.strokeOpacity = 0.5;
    syria_crisis.grid.strokeDasharray = undefined;
    syria_crisis.label.text = "Alert canceled";
    syria_crisis.label.dy = -215;
    syria_crisis.label.fillOpacity = 0.7;
    syria_crisis.label.horizontalCenter = "left";
    syria_crisis.label.fill = am4core.color("#FFFFFF");
    
    var playButton;
    
    function createSlider() {
        var sliderContainer = container.createChild(am4core.Container);
    
        sliderContainer.width = am4core.percent(100);
        sliderContainer.valign = "bottom";
        sliderContainer.padding(0, 50, 25, 50);
        sliderContainer.layout = "horizontal";
        sliderContainer.height = 50;
    
    
        playButton = sliderContainer.createChild(am4core.PlayButton);
        playButton.valign = "middle";
        playButton.events.on("toggled", function (event) {
            if (event.target.isActive) {
                play();
            }
            else {
                stop();
            }
        })
        
        slider = sliderContainer.createChild(am4core.Slider);
        slider.valign = "middle";
        slider.margin(0, 0, 0, 0);
        slider.background.opacity = 0.3;
        slider.opacity = 0.7;
        slider.background.fill = am4core.color("#ffffff");
        slider.marginLeft = 30;
        slider.height = 15;
        slider.events.on("rangechanged", function () {
            setTime();
        });
    
        slider.startGrip.events.on("drag", function () {
            stop();
            sliderAnimation.setProgress(slider.start);
        });
    
        sliderAnimation = slider.animate({ property: "start", to: 1 }, 50000, am4core.ease.linear).pause();
        sliderAnimation.events.on("animationended", function () {
            playButton.isActive = false;
        })
    }
    
    
    var sliderAnimation;
    
    function play() {
        if (slider) {
            if (slider.start >= 1) {
                slider.start = 0;
                sliderAnimation.start();
            }
            sliderAnimation.resume();
            playButton.isActive = true;
        }
    }
    
    function stop() {
        sliderAnimation.pause();
        playButton.isActive = false;
    }
    
    setTimeout(function () {
        play()
    }, 2017);
    
    var label = container.createChild(am4core.Label);
    label.text = "Total Refugee Population Worldwide";
    label.valign = "bottom";
    label.padding(0, 50, 10, 0);
    label.align = "right";
    
    chart.data = d3.json("/r_total").then(function(data){
        return [{"year": data.year, "refugee_population" : total_pop}];
    }
    
    });