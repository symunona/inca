


var params = {
    padding: 10,
    x: 8,
    y: 6,
    range: 0.4 // %*100

}

wall(params);

function generateControlPoints(params) {
    var ws = (window.innerWidth - (params.padding * 2)) / params.x,
        hs = (window.innerHeight - (params.padding * 2)) / params.y,
        points = []

    var i = 0;
    for (var x = 0; x < params.x; x++) {
        for (var y = 0; y < params.y; y++) {
            // pick a random angle and radius
            var angle = Math.random() * Math.PI * 2
            var r = Math.random() * params.range
            var point = {
                x: params.padding + (x * ws) + (Math.sin(angle) * r * ws),
                y: params.padding + (y * hs) + (Math.cos(angle) * r * hs),
                xo: params.padding + (x * ws),
                yo: params.padding + (y * hs),
                id: i++
            }
            points.push(point)
        }
    }
    return points;
}


function wall(params) {
    reset();

    var points = generateControlPoints(params);

    // get closest points
    var links = window.links = []
    points.map(function (p1) {
        p1.links = _.sortBy(points.map(function (p2) {
            var dx = p1.x - p2.x, dy = p1.y - p2.y;
            p2.distance = dx * dx + dy * dy
            if (p1.id == p2.id) {
                return false;
            }
            return p2
        }), 'distance')
            // filter out loops
            .filter((e) => e)
            // .slice(0, 7)
            .map(function (p3) {
                // filter self


                for (var i = 0; i < links.length; i++) {
                    var ln = links[i]
                    // if there is an intersection, do not add
                    if (doIntersect(ln[0], ln[1], p1, p3)) {
                        d.append('path')
                            .attr("d", function (s) { return line(d3.curveLinear)(ln) })
                            .attr('class', 'intersect1')
                        d.append('path')
                            .attr("d", function (s) { return line(d3.curveLinear)([p1, p3]) })
                            .attr('class', 'intersect2')
                        
                        if (p1 === ln[0] || p3 === ln[1]) {
                            d.append('circle')
                                .attr("cx", p1.x)
                                .attr("cy", p1.y)
                                .attr("r", 5)
                                .attr('class', 'marker')
                            d.append('circle')
                                .attr("cx", p3.x)
                                .attr("cy", p3.y)
                                .attr("r", 5)
                                .attr('class', 'marker')
                                debugger;
                            // return;
                        }
                        else {
                            return;
                        }

                    }
                }

                links.push([p1, p3])
            })

    })

    var intersections =
        d.selectAll('g.isec')
            .data(points)
            .enter()
            .append('g')
            .attr('class', 'isec')
    // .on('mouseenter', function () {
    //     this.parentElement.appendChild(this);
    // });


    d.selectAll('g.walline')
        .data(links)
        .enter()
        .append("path")
        .attr("d", function (s) { return line(d3.curveLinear)(s) })
        .attr('class', 'walline')

    intersections.append("circle")
        .attr('class', 'isec')
        .attr('cx', function (s) { return s.x })
        .attr('cy', function (s) { return s.y })
        .attr('r', 5)



    // intersections
    //     .append("text")
    //     .attr('x', function (s) { return s.params.x })
    //     .attr('y', function (s) { return s.params.y })
    //     .text(function (d) {
    //         return `p: ${d.params.points} v: ${d.params.variance}`
    //     })


    // stoneElements
    //     .append("path")
    //     .attr('class', 'frame')
    //     .attr("d", function (s) { return line(d3.curveLinearClosed)(s) })        


}
