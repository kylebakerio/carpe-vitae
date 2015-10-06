window.life      = {years:[]};
var optimism     = 100;
var now          = moment();
var currentAge;
var percentLived;
var alreadyDrawn = false;

var radio = {
  years: "Years",
  months: "Months",
  weeks: "Weeks",
  days: "Days"
};

function drawLife(){
  if ($('#birthday').val() === '') {
    alert("Please enter a birthdate.");
  } else {
    scale         = $( 'input.timeScale:checked' ).val(); //from the radio buttons
    optimism      = $('#optimism')[0].value;
    newBirthday   = moment($('#birthday').val().split(" ")[0], "MM-DD-YYYY"); //should start using this
    birthday.year = parseInt(newBirthday.format('YYYY')); //using this for mvp
    now           = new moment();
    currentAge    = (now.format("YYYY") - birthday.year); // now.subtract()
    currentAge    = currentAge < 0 ? 0 : currentAge; // handles exception for dates in the future
    timeLeft      = Math.floor((120 - currentAge)* optimism/100);
    timeLeft      = timeLeft < 0 ? 0 : timeLeft; // handles exception for dates in the past
    ageAtDeath    = currentAge + timeLeft;
    percentLived  = Math.floor((100/(ageAtDeath/currentAge))*100)/100;
    percentLived  = isNaN(percentLived) ? 0 : percentLived; // handles exception for 0 optimism for dates in the future

    window.life = {years:[]};
    for (var i = birthday.year; i < (birthday.year + currentAge + timeLeft); i++){
      // to prevent accidental very large loops during development:
      if (i > birthday.year + 3000) {
        alert("loop limit: not allowed to render ages past 3000.");
        break;
      }
      window.life.years.push([i,1,2,3,4,5,6,7,8,9,10,11,12]);
    }

    console.log(radio[scale]);

    //these are coordinates for the squares
    var location = {x:0,y:15};

    // this wipes the slate clean before every d3 render.
    if (alreadyDrawn) {
      $('.svgContainer').animate({"opacity": "0"}, 1000, function(){
        $('.svgContainer').html(""); 
        drawGrid();
      });
    } else {
      alreadyDrawn = true;
      drawGrid();
    }

    function drawGrid(){
      $('.svgContainer').css({"opacity": "1"})
      var box = d3.select(".svgContainer")
       .append("svg")
       .attr("id","theCanvas")
       .attr("width",800)
       .attr("height", 50+(5*life.years.length));
       // .style("border", "1px solid black");

      var rects = box
        .selectAll("rect")
        .data(life.years)
        .enter()
        .append("rect")
        .attr("x", function(year,i){
          location.x = (i%10 === 0 ? 168 : location.x + 50);
          return location.x;
        })
        .attr("y", function(year,i){
          if (i % 10 === 0 && i !== 0) location.y+=50;
          return location.y;
        })
        .attr("width", 35)
        .attr("height", 35)
        .style("fill-opacity","0")
        .transition()
        .delay(function(d, i) {
          return i * 30;
        })
        .duration(2000)
        .style("fill-opacity","1")
        .style("fill",function(d){
          return (d[0] - currentAge) >= birthday.year ? "orange" : "grey";
        });
      }
      // trying to overlay text of year... grrr
      //
      // // console.log(rects)
      // var overlay = box
      //   // .selectAll('g')
      //   .data($('rect'))
      //   .enter()
      //   .append("text")
      //   .text(function (d,i) {
      //     console.log(life.years[i][0], d);
      //     // console.log(d[0][0][0][__data__][0])
      //     return life.years[i][0];
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

    $('rect').on('click', function(){ $(this).css('fill', 'rgb(128, 200, 128)'); });
    $('.results').html(
      "<br/>Current Age: <strong>" + currentAge + "</strong>" +
      "<br/>Years left of life: <strong>" + timeLeft + "</strong>"  +
      "<br/>Date of Death: <strong>" + (Math.ceil(parseInt(now.format("YYYY")) + timeLeft)) + "</strong>" +
      "<br/>Percent of life lived: <strong>" + percentLived + "%</strong>" +
      "<br/>Presumed total length of life: <strong>" + (currentAge + timeLeft) + " years</strong>" 
    );
  }
}
