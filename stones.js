function stones(params) {    
    reset();    

    var stones = [];
    var size = { x: 10, y: 6 }
    var padding = 50;
    var gap = {
        x: (window.innerWidth - padding) / size.x,
        y: (window.innerHeight - padding) / size.y,
    }

    for (var x = 0; x < size.x; x++) {
        for (var y = 0; y < size.y; y++) {
            var stoneParams = {
                radius: 25,
                points: Math.round(4 + (x / 1.1)),
                variance: 10 + y * 5,
                x: padding + (x * gap.x),
                y: padding + (y * gap.y)
            }
            stones.push(stone(stoneParams))
        }
    }

    var stoneElements = 
        d.selectAll('g')            
            .data(stones)
            .enter()
            .append('g')
            .attr('class', 'stone')
            .on('mouseenter', function() {                                
                this.parentElement.appendChild(this);
            });

    stoneElements.append("path")
        .attr('class', 'wall')
        .attr("d", function (s) { return line()(s) })        

    stoneElements
        .append("text")
        .attr('x', function (s) { return s.params.x })
        .attr('y', function (s) { return s.params.y })
        .text(function (d) { 
            return `p: ${d.params.points} v: ${d.params.variance}`            
        })


    // stoneElements
    //     .append("path")
    //     .attr('class', 'frame')
    //     .attr("d", function (s) { return line(d3.curveLinearClosed)(s) })        

    
}
