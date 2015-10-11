  window.life      = {years:[]};
var optimism     = 100;
var now          = moment();
var alreadyDrawn = false;

var radio = {
  years: "Years",
  months: "Months",
  weeks: "Weeks",
  days: "Days"
};

function drawLife(){
  if ($('#birthday').val() === '') {
    $('.svgContainer').html("<p.starter-template>Please enter a birthdate.</p>"); 
    window.alreadyDrawn = true;
  } else {
    var scale      = $('input.timeScale:checked').val(); //from the radio buttons
    var size,rowWidth;

    if (scale === "years")  {
      rowWidth   = 10;
      size       = 35;
      spacing    = 50;
      multiplier = 1;
      start      = 148;
      speed      = 2000;
      speed2     = 30;
      extra      = 0;
    } else if (scale === "months") {
      rowWidth   = 36;
      size       = 35*.33;
      spacing    = 50*.33;
      multiplier = 12;
      start      = 108;
      speed      = 1500;
      speed2     = 10;
      extra      = 70;
    } else if (scale === "weeks")  {
      rowWidth   = 52;
      size       = 50*.2;
      spacing    = 50*.4;
      multiplier = 52;
      start      = 10;
      speed      = 200;
      speed2     = 20;
      extra      = 200;
    } else if (scale === "days")   {
      rowWidth   = 365;
      size       = 35/12/4/7;
      spacing    = 50*.02;
      multiplier = 365;
      start      = 0;
      speed      = 30;
      speed2     = 10;
      extra      = 100;
    }

    var optimism      = $('#optimism')[0].value;
    var newBirthday   = moment($('#birthday').val().split(" ")[0], "MM-DD-YYYY"); //should start using this
    var birthYear     = parseInt(newBirthday.format('YYYY')); //using this for mvp
    var now           = new moment();
    var currentAge    = moment.duration(moment().diff(newBirthday))
    var currentAgeYrs = currentAge.asYears() < 0 ? 0 : currentAge.asYears(); // handles exception for dates in the future
    var timeLeft      = moment.duration((120*multiplier-Number(currentAge.as(scale)))*(optimism/100), scale) 
    var timeLeftYrs   = timeLeft.asYears() < 0 ? 0 : timeLeft.asYears(); // handles exception for dates in the past
    var ageAtDeath    = moment.duration(Number(currentAge.as(scale)) + Number(timeLeft.as(scale)), scale);
    var ageAtDeathYrs = currentAgeYrs + timeLeftYrs;
    var percentLived  = Math.floor((100/(ageAtDeathYrs/currentAgeYrs))*100)/100;
        percentLived  = isNaN(percentLived) ? 0 : percentLived; // handles exception for 0 optimism for dates in the future (i.e., 0*0)

    var tick = 0; 
    window.life = [];
    for (var i = 0; i < Math.floor(ageAtDeath.as(scale)); i++){
      // to prevent accidental very large loops during development:
      if (i > birthYear + 30000) {
        alert("loop limit: not allowed to render datasets past 30k units. Your attempted unit size: " + ageAtDeath.as(scale));
        break;
      }
      //tick = i % multiplier === 0 ? tick+1 : tick; //should stop using this
      window.life.push([i]);
    }
    console.log(life.length)

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
       .attr("height", extra+spacing+(5*life.length/multiplier));
       // .style("border", "1px solid black");

      var rects = box
        .selectAll("rect")
        .data(life)
        .enter()
        .append("rect")
        .attr("x", function(year,i){
          location.x = (i%rowWidth === 0 ? start : location.x + spacing);
          return location.x;
        })
        .attr("y", function(year,i){
          if (i % rowWidth === 0 && i !== 0) location.y+=spacing;
          return location.y;
        })
        .attr("width", size)
        .attr("height", size)
        .style("fill-opacity","0")
        .transition()
        .delay(function(d, i) {
          return i * speed2;
        })
        .duration(speed)
        .style("fill-opacity","1")
        .style("fill",function(d){
          return (d[0] >= Math.floor(currentAge.as(scale)) ? "orange" : "grey");
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
    $('rect').on('click', function(){ $(this).css('fill', 'rgb(128, 200, 128)'); });
    $('.results').html(
      "<br/>Current Age: <strong>" + Math.floor(currentAgeYrs) + "</strong>" +
      "<br/>Years left of life: <strong>" + timeLeftYrs + "</strong>"  +
      "<br/>Date of Death: <strong>" + (Math.ceil(parseInt(now.format("YYYY")) + timeLeftYrs)) + "</strong>" +
      "<br/>Percent of life lived: <strong>" + percentLived + "%</strong>" +
      "<br/>Presumed total length of life: <strong>" + Math.floor(currentAgeYrs + timeLeftYrs) + " years</strong>" 
    );
  }
}
