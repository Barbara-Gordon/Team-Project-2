function renderChart(refugeeData) {
    // Themes begin
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv", am4charts.ChordDiagram);

    // colors of main characters
    chart.colors.saturation = 0.45;
    chart.colors.step = 3;
    var colors = {
        Rachel: chart.colors.next(),
        Monica: chart.colors.next(),
        Phoebe: chart.colors.next(),
        Ross: chart.colors.next(),
        Joey: chart.colors.next(),
        Chandler: chart.colors.next()
    }

    console.log(refugeeData)
    chart.data = refugeeData;
    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";

    chart.nodePadding = 0.5;
    chart.minNodeSize = 0.01;
    chart.startAngle = 80;
    chart.endAngle = chart.startAngle + 360;
    chart.sortBy = "value";
    chart.fontSize = 10;

    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.propertyFields.fill = "color";
    nodeTemplate.tooltipText = "{name}'s kisses: {total}";

    // when rolled over the node, make all the links rolled-over
    nodeTemplate.events.on("over", function (event) {
        var node = event.target;
        node.outgoingDataItems.each(function (dataItem) {
            if (dataItem.toNode) {
                dataItem.link.isHover = true;
                dataItem.toNode.label.isHover = true;
            }
        })
        node.incomingDataItems.each(function (dataItem) {
            if (dataItem.fromNode) {
                dataItem.link.isHover = true;
                dataItem.fromNode.label.isHover = true;
            }
        })

        node.label.isHover = true;
    })

    // when rolled out from the node, make all the links rolled-out
    nodeTemplate.events.on("out", function (event) {
        var node = event.target;
        node.outgoingDataItems.each(function (dataItem) {
            if (dataItem.toNode) {
                dataItem.link.isHover = false;
                dataItem.toNode.label.isHover = false;
            }
        })
        node.incomingDataItems.each(function (dataItem) {
            if (dataItem.fromNode) {
                dataItem.link.isHover = false;
                dataItem.fromNode.label.isHover = false;
            }
        })

        node.label.isHover = false;
    })

    var label = nodeTemplate.label;
    label.relativeRotation = 90;

    label.fillOpacity = 0.4;
    let labelHS = label.states.create("hover");
    labelHS.properties.fillOpacity = 1;

    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    // this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
    nodeTemplate.adapter.add("fill", function (fill, target) {
        let node = target;
        let counters = {};
        let mainChar = false;
        node.incomingDataItems.each(function (dataItem) {
            if (colors[dataItem.toName]) {
                mainChar = true;
            }

            if (isNaN(counters[dataItem.fromName])) {
                counters[dataItem.fromName] = dataItem.value;
            }
            else {
                counters[dataItem.fromName] += dataItem.value;
            }
        })
        if (mainChar) {
            return fill;
        }

        let count = 0;
        let color;
        let biggest = 0;
        let biggestName;

        for (var name in counters) {
            if (counters[name] > biggest) {
                biggestName = name;
                biggest = counters[name];
            }
        }
        if (colors[biggestName]) {
            fill = colors[biggestName];
        }

        return fill;
    })

    // link template
    var linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.15;
    linkTemplate.tooltipText = "{fromName} -> {toName}:{value.value}";

    var hoverState = linkTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 0.7;
    hoverState.properties.strokeOpacity = 0.7;

    // data credit label
    var creditLabel = chart.chartContainer.createChild(am4core.TextLink);
    creditLabel.text = "Data source: notrudedude";
    creditLabel.url = "https://www.reddit.com/user/notrudedude";
    creditLabel.y = am4core.percent(99);
    creditLabel.x = am4core.percent(99);
    creditLabel.horizontalCenter = "right";
    creditLabel.verticalCenter = "bottom";

}

function yearOnChange(year) {
    window.year = year

    var url = `/refugees_by_year?year=${year}`
    d3.json(url).then(function (refugeeData) {
        window.refugeeData = refugeeData;

        renderCountrySelector(refugeeData)
    })
}

function renderCountrySelector(refugeeData) {
    // filter the refugee data and get a list of countries
    // var countryMap = refugeeData.reduce((accum, row) => {
    //     if (!accum[row.from]) {
    //         accum[row.from] = 0
    //     }
    //     accum[row.from] += row.value
    //     return accum
    // }, {})

    var countryMap = {}
    for (var i = 0; i < refugeeData.length; i++) {
        var row = refugeeData[i]
        if (!countryMap[row.from]) {
            countryMap[row.from] = 0
        }
        countryMap[row.from] += row.value
    }

    console.log(countryMap)

    var countries = Object.keys(countryMap).sort((a, b) => countryMap[b] - countryMap[a])

    console.log(countries)

    // using d3, select the country selector
    var countrySelector = d3.select("#selectCountry")

    // clear its contents
    countrySelector.html("")

    // populate the selector with the new set of countries
    countries.forEach((country) => {
        countrySelector
            .append("option")
            .text(`${country} (${formatRefugeeCount(countryMap[country])})`)
            .property("value", country);
    });

    // call countryOnChange with the default country
    var defaultCountry = countries[0];
    countryOnChange(defaultCountry)
}

function formatRefugeeCount(count) {
    if (count > 1000000) {
        return Math.round(count / 1000000) + " M"
    } else if (count > 1000) {
        return Math.round(count / 1000) + " K"
    } else {
        return count
    }
}

function countryOnChange(countryName) {
    window.countryName = countryName

    refreshTitle()

    // filter refugee data for the currently selected country
    var refugeeDataForCountry = window.refugeeData.filter(row => row.from == countryName)
    renderChart(refugeeDataForCountry)
}

function refreshTitle() {
    d3.select("#title").text(`Refugee data for ${window.countryName}, ${window.year}`)
}

// Entrypoint for the javascript calls. This function is executed once the
// DOM is loaded.
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the dashboard
    init();
})

function init() {
    // Grab a reference to the dropdown select year element
    var yearSelector = d3.select("#selectYear");

    // Use the list of years to populate the select options
    d3.json("/year").then((years) => {
        years.forEach((year) => {
            yearSelector
                .append("option")
                .text(year)
                .property("value", year);
        });

        // Use the first sample from the list to build the initial plots
        const defaultYear = years[0];
        yearOnChange(defaultYear);
    });
}