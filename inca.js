var d = svg()

function wall(params) {
    console.log('drawing wall with params', params)


    d.append("circle")
        .attr("cx", window.innerWidth / 2)
        .attr("cy", window.innerHeight / 2)
        .attr("r", 50)
        .style("stroke", "purple")
        .style("fill", "transparent")

    var s = stone({
        // How many control points will the stone have
        points: 5,
        // What is the reference circle's radius
        radius: 100,
        // Random variance from the circle's radius.
        // Left 0 will produce a circle.
        variance: 20,

        // Randomize the starting angle. 1 is full, 0 is none.
        angle: 1
    })

    var offset = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };

    d.append('g')
        .attr('transform', m(offset))
        .append("path")
        .attr("d", line()(s))
        .attr("stroke", "green")
        .attr("stroke-width", 1)
        .attr("fill", "none");

}

function m(offset) {
    return `translate(${offset.x},${offset.y})`
}

function svg() {
    return d = d3.select('body')
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)    
}

function reset() {
    d3.select("svg").remove();
    return svg()
}

function line(c) {
    return d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; })
        .curve(c || d3.curveCardinalClosed);
}


function stone(params) {
    var angle = Math.PI * 2 / params.points;

    params.x = params.x || 0
    params.y = params.y || 0
    params.angle = params.angle || 0

    var points = []
    for (var i = 0; i < params.points; i++) {
        var a = angle * i + (Math.random() * params.angle)
        var r = params.radius + ((params.variance / 2) - Math.random() * params.variance)
        points.push({
            x: Math.sin(a) * r + params.x,
            y: Math.cos(a) * r + params.y            
        })
    }
    points.params = params
    // points.push(points[0]);
    return points;

}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }