


var params = {
    padding: 50,
    x: 8,
    y: 6,
    range: 0.45, // %*100
    minEdges: 3, // this makes sure that every dot has edges to somewhere
    edges: 2 // this will add 0-edges number of new edges randomly
}

wall(params);

function generateControlPoints(params) {
    var ws = (window.innerWidth - (params.padding * 2)) / (params.x - 1),
        hs = (window.innerHeight - (params.padding * 2)) / (params.y - 1);
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
    shuffle(points).map(function (p1) {
        // iterate over all the points (shall be slow on a large dataset)
        _.sortBy(points.map(function (p2) {
            var dx = p1.x - p2.x, dy = p1.y - p2.y;
            p2.distance = dx * dx + dy * dy
            // ignore self
            if (p1.id == p2.id) {
                return false;
            }
            return p2
        }), 'distance')
            // filter out loops
            .filter((e) => e)
            // .slice(0, 7)            
            .slice(0, Math.floor(params.minEdges + Math.random() * params.edges))
            .map(function (p4) {
                // add it link it
                if (linkCanBeAdded(links, p1, p4)) {
                    return addEdge(links, p1, p4)
                }

            })
    })


    // there will be one more circle, which wraps the whole, eliminate that.

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

    // intersections.append("circle")
    //     .attr('class', 'isec')
    //     .attr('cx', function (s) { return s.x })
    //     .attr('cy', function (s) { return s.y })
    //     .attr('r', 5)



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

var circles = []

function findCircles() {

    // iterate over every point to find circles
    for (var i = 0; i < links.length; i++) {
        findCircle(links[i])
    }

    // remove the longes circle
    circles = _.sortBy(circles, 'length')
    circles.splice(-2)
    console.log(circles)


    var circleGroups = d.selectAll('g.circle')
        .data(circles)
        .enter()
        .append('g')
        .attr('class', 'circle')

    circleGroups.append('circle')
        .attr('class', 'cc')
        .attr('cx', (c) => getCenter(c).x)
        .attr('cy', (c) => getCenter(c).y)
        .attr('r', 6)
    circleGroups.append('path')
        .attr("d", (s) => line(d3.curveLinearClosed)(s))
        .attr('class', 'circle')

}


function findCircle(edge) {

    // showPoint(edge[0], 'black', 'X', 10)
    // showPoint(edge[1], 'cyan', 'X', 7)

    if (!edge.left) {
        var c = findCircleSide(edge, 'left');
        showCircle(c)
    }
    if (!edge.right) {
        findCircleSide(edge, 'right')
        var c = findCircleSide(edge, 'left');
        // showCircle(c)
    }

}

function findCircleSide(edge, side) {
    var startingPoint = edge[0]
    var neighbour = edge[1]

    var circle = [startingPoint]
    var closestNeighbours = findNeigbouringEdges(neighbour, startingPoint)

    while (closestNeighbours[side] !== startingPoint) {

        var from = circle[circle.length - 1];
        var to = closestNeighbours[side];

        circle.push(to)
        closestNeighbours = findNeigbouringEdges(from, to)
    }
    // !!!!!!!!!!!!!!!!!
    circles.push(addCircle(circle));
    
    // Fill up the edge, so we do not go down this road again
    for (var i = 0; i < circle.length; i++) {
        var edge = findEdge(circle[i], circle[(i + 1) % circle.length])
        if (!edge){
            console.error(circle, i)
            showPoint(circle[i], 'red', 'from', 5)
            showPoint(circle[(i + 1) % circle.length], 'yellow', 'to', 5)
        
            debugger;
        }
        edge[side] = circle;
    }

    return circle
}

function showCircle(c) {
    d.append('circle')
        .attr('class', 'cc')
        .attr('cx', getCenter(c).x)
        .attr('cy', getCenter(c).y)
        .attr('r', 6)
    d.append('path')
        .attr("d", line(d3.curveLinearClosed)(c))
        .attr('class', 'circle')

}

function showPoint(p, fill, string, r) {
    d.append('circle').attr('class', 'marker').attr('cx', p.x).attr('cy', p.y).attr('r', r || 3).attr('fill', fill || 'red')
    if (string)
        d.append('text')
            .text(string)
            .attr('x', p.x)
            .attr('y', p.y)
}

function addCircle(circle) {
    circle.map(function (p) {
        if (!p.circles) p.circles = []
        p.circles.push(circle);
    })
    _.extend(circle, getCenter(circle))
    return circle
}

function mergeTriangles(){
    // find all triangles
}

function getCenter(array) {
    var xsum = _.pluck(array, 'x').reduce(function (prev, x) { return prev + x }, 0),
        ysum = _.pluck(array, 'y').reduce(function (prev, y) { return prev + y }, 0),
        x = xsum / array.length,
        y = ysum / array.length;

    if (x == NaN || y == NaN) {
        debugger;
        throw new Error('Ehh!')
    }
    return { x, y }
}


function isPointPartOfAllCirclesItNeads(point) {
    if (!point.circles) return false;
    return point.circles.length > point.links.length
}

function findNeigbouringEdges(fromPoint, toPoint) {
    // find other angles for point    
    if (!fromPoint || !toPoint) {
        debugger;
    }
    if (fromPoint.links.indexOf(toPoint) === -1) {
        showPoint(fromPoint, 'red', 'from', 5)
        showPoint(toPoint, 'yellow', 'to', 5)
        debugger;
        throw new Error('from and to points are not linked')
    }
    removeText();
    // showPoint(toPoint, 'cyan')
    var pointsSortedByAngle = _.sortBy(toPoint.links
        .map(function (p) {
            // now fill the angles

            return { point: p, angle: Math.atan2((p.x - toPoint.x), (p.y - toPoint.y)) }
        }), 'angle')
    // pointsSortedByAngle.map(function(p, i){
    //     showPoint(p.point, 'yellow', i);
    // })
    // showPoint(fromPoint, 'black')

    var referencePointWithAngleIndex = pointsSortedByAngle.indexOf(
        _.find(pointsSortedByAngle, { point: fromPoint }));
    if (referencePointWithAngleIndex === -1) {
        showPoint(fromPoint, 'red', 'from', 5)
        showPoint(toPoint, 'yellow', 'to', 5)
        debugger;
        throw new Error("baaad")
    }
    var ret = {
        left: pointsSortedByAngle[(referencePointWithAngleIndex + 1) % pointsSortedByAngle.length].point,
        right: pointsSortedByAngle[(pointsSortedByAngle.length + referencePointWithAngleIndex - 1) % pointsSortedByAngle.length].point
    }
    // showPoint(ret.left, 'green')
    // showPoint(ret.right, 'blue')
    return ret
}

function removeText() {
    d.selectAll('text').remove()
}

function addEdge(links, p1, p2) {
    var edge = [p1, p2]
    if (!p1.links) p1.links = [];
    if (!p2.links) p2.links = [];
    var newEdge = false
    if (p1.links.indexOf(p2) === -1) {
        p1.links.push(p2)
        links.push(edge)
    }
    if (p2.links.indexOf(p1) === -1) p2.links.push(p1);

    return edge;
}

function findEdge(p1, p2) {
    return _.find(links, (l) => l[0] === p1 && l[1] === p2) || _.find(links, (l) => l[1] === p1 && l[0] === p2)
}

function linkCanBeAdded(links, p1, p3) {
    for (var i = 0; i < links.length; i++) {
        var ln = links[i]

        // if it has a same source or dest, it's good, keep checking for others.
        if (p1 === ln[0] || p3 === ln[1] || p1 === ln[1] || p3 === ln[0]) {
            continue;
        }
        // if there is an intersection, filter it out.
        if (doIntersect(ln[0], ln[1], p1, p3)) {
            return false;
        }
    }
    // if we did not return from the last, we are good with the line 
    return true
}

