// just some examples to reference how moment works.

moment().add(7, 'days').add(1, 'months'); // with chaining
moment().add({days:7,months:1}); // with object literal

var m = moment(new Date(2011, 2, 12, 5, 0, 0)); // the day before DST in the US
m.hours(); // 5
m.add(1, 'days').hours(); // 5

var duration = moment.duration({'days' : 1});
moment([2012, 0, 31]).add(duration); // February 1

var a = moment().subtract(1, 'day');
var b = moment().add(1, 'day');

// some svg and d3 stuff


<!--
<svg width="300" height="180">
<circle cx="30"  cy="50" r="25" />
<rect x="130" y="80" width="40" height="40" class="fancy" />
</svg> 
-->

// old unfinished idea:
//
// // console.log(rects)
// var overlay = box
//   // .selectAll('g')
//   .data($('rect'))
//   .enter()
//   .append("text")
//   .text(function (d,i) {
//     console.log(life[i][0], d);
//     // console.log(d[0][0][0][__data__][0])
//     return life[i][0];
//   })
//   .attr("x",function (d) {
//     console.log('d.x: ' + d.x)
//     return d.x;
//   })
//   .attr("y",function (d) {
//     return d.y;
//   })
//   .attr('text-anchor', 'middle')
//   .style("fill", "black")
//   .style("stroke-width", 1.5);
// }
