// Defining dimension and color properties
let height = window.innerHeight - (window.innerHeight / 4);
let width = window.innerWidth - (window.innerWidth / 4);
let padding = window.innerWidth / 50
let userColor = "#ff0000"

// Define the SVG's

let svg = d3
    .select('#graphic')
    .append('svg')
    .attr("class", "svg1")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", "-150 200 1800 1000")
    .append('g');

let svg2 = d3
    .select('.content-inner')
    .append('svg')
    .attr('height', window.innerHeight)
    .attr('width', window.innerWidth/4);

let svg3 = d3
    .select('#graphic')
    .append('svg')
    .attr("class", "svg3")
    .append('g')

// Defining the Objectives Array
let objectivelist = [
    ["Run 5000 meters for 10 points!", 10],
    ["Run 10000 meters for 30 points!", 30],
    ["Walk 5000 meters for 5 points!", 5],
    ["Walk 10000 meters for 10 points!", 10],
    ["Cycle 5000 meters for 15 points!", 15],
    ["Cycle 10000 meters for 5 points!", 5],
    ["Cycle 25000 meters for 25 points!", 25],
]

// Define color scale

let colorScale = d3.scaleSequential()
    .domain([0, 99])
    .interpolator(d3.interpolateRainbow);




// Initializing the polygon file and data file
Promise.all([
    d3.xml('tiles.svg'),
    d3.csv('state-data.csv')
]).then(ready)


// Start drawing the Hexagon Map
function ready([hexFile, datapoints]) {

    // Obligatory defining of variables
    let completed = 0
    let currProv
    let neighbors = []
    let tasks;
    let objectivetextlist = "";
    let neighbor = "";
    let textWidth = width/7
    let imported = d3.select(hexFile).select('svg')
    let active = []
    let path = d3.geoPath();
    let initial = 0
    let first = Math.floor(Math.random()*23).toString()


    // Button for completing province
    let button = document.createElement("button");
    button.innerHTML = "Complete Province [TEST]";
    button.className = "provinceButton"
    let body2 = document.getElementsByClassName("content-inner");
    body2[0].appendChild(button);

    let steps = document. createElement('input')
    steps.setAttribute('type', 'number')
    steps.setAttribute('value', "0")
    steps.setAttribute('step', 5)
    steps.setAttribute('id', 'stepcounter')
    body2[0].appendChild(steps);

    svg.html(imported.html())

    datapoints.forEach(d => {
        svg.select("#" + d.abbr)
            .attr('class', 'hex-group')
            .each(function() {
                d3.select(this).datum(d)
            })
    })

    // Declare variables for the first province
    svg.selectAll('.hex-group')
            .each(function (d) {
                if (d.id === first && initial === 0) {
                    initial = 1
                    active.push(d.id)
                    currProv = d.name
                    tasks = d.tasks
                    nb = d.nb
                    goal = d.goal
                }
            })

    // Defining the Rectangles used for the text
    let tooltipBox = svg2.append("rect")
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", width / 5)
        .attr("height", window.innerHeight/2)
        .attr('fill', 'rgba(255,255,255,0.4)')
        .attr("class", "tooltipBox")
        .attr('stroke', '#136610')
        .attr('stroke-width', '7');

    let tooltip = d3.select("body")
        .append("div")
        .attr('class', 'tooltip')
        .style('opacity', 0)

    let newProvinceBox = svg3.append("rect")
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("x", width / 2.075)
        .attr("y", height / 55)
        .attr("width", width / 4)
        .attr("height", height / 10)
        .attr('fill', 'rgba(255,255,255,0.4)')
        .attr("class", "tooltipBox")
        .attr('stroke', '#136610')
        .attr('stroke-width', '7')
        .style('opacity', 0)


    // Displaying the Objectives
    for (let i = 0; i < tasks.length; i++) {
        let temp = tasks[i];
        let temp2 = objectivelist[temp][0] + " "
        objectivetextlist = objectivetextlist.concat(temp2);
    }

    // All texts
    let pointsGoal = svg2.append("text")
        .attr("x", width / 35)
        .attr("y", height/2.25)
        .text("Score at least " + goal + " points to take over the province!")
        .style("font-weight", window.innerWidth/5)
        .style("font-size", 18)
        .style("fontColor", "#000000")
        .call(wrap2, function() {
            return textWidth*1.1;
        });


    let chooseProvince = svg2.append("text")
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("x", width / 2)
        .attr("y", height / 15)
        .text("Choose your next province!")
        .style("font-weight", window.innerWidth/5)
        .style("fontColor", "#ffffff")
        .style("font-size", 32)
        .style("opacity", 0);

    let currentProvince = svg2.append("text")
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("x", width / 35)
        .attr("y", height / 15)
        .text(currProv)
        .style("font-weight", window.innerWidth/5)
        .style("font-size", window.innerWidth/50);


    let currentTasks = svg2.append("text")
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("x", width / 5)
        .attr("y", window.innerHeight/6)
        .text(objectivetextlist)
        .style("font-weight", window.innerWidth/5)
        .style("font-size", 18)
        .call(wrap, function() {
            return textWidth;
        });


    // When adding points
    steps.addEventListener('change', function() {
        console.log('change')
        console.log(goal)
        let step = document.getElementById('stepcounter').value;
        if (step === goal) {
            alert('completed!')
            completeProvince()
        }
    })

    // TEST button
    button.addEventListener ("click", completeProvince)

    // When completing a Province
    function completeProvince() {
        completed = 1

        newProvinceBox.transition()
            .duration(20)
            .style("opacity", 1);

        chooseProvince.transition()
            .duration(20)
            .style("opacity", 1);

        for (let i = 0; i < nb.length+1; i++) {
            let letter = nb[i];
            neighbor = neighbor + letter
            if (i === 2 ||  i === 5 || i === 8 || i === 11 ||  i === 14 || i === 17) {
                svg.selectAll('.hex-group')
                    .each(function(d) {
                        let group2 = d3.select(this);
                        group2.selectAll('polygon')
                            .attr('fill', function() {
                                if (active.includes(d.id)) {
                                    return userColor
                                }

                                else if (d.abbr === neighbor) {
                                    console.log("Neighbor variable: " + neighbor)
                                    return "#378c48"
                                }

                                else if (neighbors.includes(d.abbr)) {
                                    return "#378c48"
                                }

                                else {
                                    return "#f4f2ff"
                                }

                            })

                            .attr('opacity', 0.5)
                            .attr('stroke', 'black')
                            .attr('stroke-width', 0.5)
                    })

                neighbors.push(neighbor)
                neighbor = ""
            }

        }
    }

    // Fill the active Province
    svg.selectAll('.hex-group')
        .each(function(d) {
            let group = d3.select(this)
            last = active.length-1
            group.selectAll('polygon')
                .attr('fill', function() {
                    if (active[last] === d.id) {
                        return "#71127a"
                    }
                    if (active.includes(d.id)) {
                        return userColor
                    }
                    else {
                        return "#f4f2ff"
                    }
                })
                .attr('opacity', 0.5)
                .attr('stroke', 'black')
                .attr('stroke-width', 0.5)
        })

    // Merge the Provinces and Draw Borders
    svg.selectAll('.hex-group')
        .each(function(d) {

            let group = d3.select(this);

            let polygons = group
                .selectAll('polygon')
                .nodes()
                .map(function (node) {
                    return node.getAttribute('points').trim()
                })
                .map(function (pointString) {
                    let regex = /(([\d\.]+)[ ,]([\d\.]+))/g;
                    return pointString.match(regex).map(function (pair) {
                        let coords = pair.split(/[ ,]/);
                        return [+coords[0], +coords[1]]
                    })
                })
                .map(function (coords) {
                    coords.push(coords[0])
                    return turf.polygon([coords])
                });


            let merged = turf.union(...polygons);

            group.append('path')
                .datum(merged)
                .attr('class', 'outline')
                .attr('d', path)
                .attr('stroke', 'black')
                .attr('stroke-width', 3)
                .attr('fill', 'none')

            // var center = path.centroid(merged)
            let center = polylabel(merged.geometry.coordinates);

            group.append('text')
                .attr('class', 'outline')
                .attr('transform', `translate(${center})`)
                .text(d.abbr)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('font-weight', 'bold')
                .attr('font-size', 16)

            group.append('svg:image')
                .attr('x', -(width/50))
                .attr('y', -(height/40))
                .attr('width', width/20)
                .attr('height', height/20)
                .attr('transform', `translate(${center})`)
                .attr("xlink:href", "https://static.remove.bg/remove-bg-web/45a72906c90d42939a65e239566fa322bcc1f4f2/assets/start_remove-79a4598a05a77ca999df1dcb434160994b6fde2c3e9101984fb1be0f16d0a74e.png")
                .attr("visibility", function(d) {
                    if (active.includes(d.id)) {
                        return "visible"
                    }
                    else {
                        return "hidden"
                    }
                })
        })

        // Mouse Event Handlers
        .on('mouseover', function(d) {
            d3.select(this).selectAll('polygon').attr('opacity', 0.8)
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(
                "Province:" + "<br/>"  + d.name + "<br/>" + "Tasks:" + d.tasks)
                .style("left", (d3.event.pageX + 14) + "px")
                .style("top", (d3.event.pageY + 14) + "px");
        })

        .on('mouseout', function() {
            d3.select(this).selectAll('polygon').attr('opacity', 0.5)
        })

        .on("click", function(d){
            if (completed === 1 && neighbors.includes(d.abbr)) {
                completed = 0
                active.push(d.id)
                last = active.length-1
                console.log(last)
                console.log(active[last])
                newProv = active[active.length - 1]

                if (newProv === d.id) {
                    currProv = d.name
                    tasks = d.tasks
                    nb = d.nb
                    goal = d.goal
                    for (let i = 0; i < tasks.length; i++) {
                        if (i === 0) {
                            objectivetextlist = ""
                        }
                        let temp = tasks[i];
                        let temp2 = objectivelist[temp][0] + " "
                        objectivetextlist = objectivetextlist.concat(temp2);
                    }
                        currentProvince.transition()
                            .text(currProv)

                        pointsGoal
                            .text("Score at least " + goal + " points to take over the province!")
                            .call(wrap2, function() {
                                return textWidth*1.1;
                            });
                        currentTasks
                            .text(objectivetextlist)
                            .call(wrap, function(){
                                return textWidth
                            })
                }


                newProvinceBox.transition()
                    .duration(200)
                    .style("opacity", 0);

                chooseProvince.transition()
                    .duration(200)
                    .style("opacity", 0);

                svg.selectAll('.hex-group')

                    .each(function(d) {
                        if (active[last]===d.id) {
                            let group2 = d3.select(this);
                            group2.select('image')
                                .attr("visibility", "visible")
                            group2.selectAll('polygon')
                                .attr('fill', function () {
                                    return "#540b70"
                            })
                        }
                        else if (active.includes(d.id)) {
                            let group2 = d3.select(this);
                            group2.select('image')
                                .attr("visibility", "visible")
                            group2.selectAll('polygon')
                                .attr('fill', function () {
                                    return userColor
                                })
                        }
                        else {
                            let group2 = d3.select(this);
                            group2.selectAll('polygon')
                                .attr('fill', function () {
                                    return "#f4f2ff"
                                })
                        }
                    })
            }
        })

}

// Text Wrapping Functions

function wrap(text, width) {
    text.each(function() {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 4, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")) || 0,
            tspan = text.text(null).append("tspan").attr("x", 50).attr("y", y).attr("dy", dy + "em");

        width = (typeof width === "function") ? width.call(this) : width;

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 50).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

function wrap2(text, width) {
    text.each(function() {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.7, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")) || 0,
            tspan = text.text(null).append("tspan").attr("x", 50).attr("y", y).attr("dy", dy + "em");

        width = (typeof width === "function") ? width.call(this) : width;

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 50).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

