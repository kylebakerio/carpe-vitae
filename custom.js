
  var life         = {years:[]};
  var optimism     = 100;
  var now          = moment();
  var alreadyDrawn = false;

  var radio = {
    years: "Years",
    months: "Months",
    weeks: "Weeks",
    days: "Days"
  };

  var squareSize,rowSize,spacing,multiplier,start,duration,delay;

  function drawLife(){
    console.log("---------------")
    if ($('#birthday').val() === '') {
      $('.svgContainer').html(
        "<p class='no_birthday starter-template'>Please enter a birthdate.</p>"
        );
      $('.no_birthday').fadeTo(500, 1); 
      window.alreadyDrawn = true;
    } else {
      window.scale = $('input.timeScale:checked').val(); //from the radio buttons
      if (scale  === "years")       {
        comment     = "Each row contains 10 years.";
        yearsPerRow = 10;
        rowSize     = 10;
        squareSize  = 35;
        spacing     = 15;
        multiplier  = 1;
        duration    = 2000;
        delay       = 30;
      } else if (scale === "months") {
        comment     = "Each row contains 36 months (3 years).";
        yearsPerRow = 3;
        rowSize     = 36;
        squareSize  = 12;
        spacing     = 5;
        multiplier  = 12;
        duration    = 1000;
        delay       = 10;
      } else if (scale === "weeks")  {
        comment     = "Each row contains 52 weeks.";
        yearsPerRow = 1;
        rowSize     = 52;
        squareSize  = 8;
        spacing     = 3;
        multiplier  = 52;
        duration    = 1000;
        delay       = 5;
      } else if (scale === "days")   {
        comment     = "Each row contains 365 days.";
        yearsPerRow = 1;
        rowSize     = 365;
        squareSize  = 2;
        spacing     = 1;
        multiplier  = 365;
        duration    = 2000;
        delay       = 1;
      }

      rowWidth = (rowSize * squareSize) + ((rowSize - 1) * spacing);
      start    = ($('.svgContainer').width() - rowWidth)/2;
      
      // diagnostics:
      // alert("div size: " + $('.svgContainer').width() + ", rowWidth " + rowWidth + ", start: " + start);

      window.optimism      = $('#optimism')[0].value;
      window.birthdate     = moment($('#birthday').val(), "MM/DD/YYYY hh:mm A");
      window.currentAge    = moment.duration(moment().diff(birthdate));
      window.timeLeft      = moment.duration((120*multiplier-Number(currentAge.as(scale)))*(optimism/100), scale) 
      window.ageAtDeath    = moment.duration(Number(currentAge.as(scale)) + Number(timeLeft.as(scale)), scale);
      window.percentLived  = Math.floor((100/(ageAtDeath.as('days')/currentAge.as('days')))*100)/100;
             percentLived  = isNaN(percentLived) ? 0 : percentLived; // handles exception for 0 optimism for dates in the future (i.e., 0*0)

      window.life = [];
      if (ageAtDeath.as(scale) < 50000 || 
          prompt("50k range size limit reached. Your attempted unit size: " + 
            Math.floor(ageAtDeath.as(scale)) + 
            ". if you want to try this anyways--it may crash your browser!--type 'yes'") === 'yes') {
        
        for (var i = 0; i < ageAtDeath.as(scale); i++){
          window.life.push(i);
        }
      } 

      if (alreadyDrawn) {
        $('.svgContainer').animate({"opacity": "0"}, 1000, function(){
          $('.svgContainer').html("");
          // for some reason if I pull these two function calls out
          // and put it after this if/else block, they don't fire
          // the second time. I really can't figure out why...
          drawStats();
          drawGrid();
        });
      } else {
        alreadyDrawn = true;
        drawStats();    
        drawGrid();
      }
    }
  }

  function drawStats() {
    console.log("drawStats")

    $('rect').on('click', function(){ $(this).css('fill', 'rgb(128, 200, 128)'); });
    $('.results').html(
      "<strong>Grey squares represent units of life already lived, gold represents units remaining.</strong>" +
      "<br />" + comment +
      "<br/>Current Age: <strong>" + Math.floor(currentAge.asYears()) + "</strong>" +
      "<br/>Time left: <strong>" + moment().add(timeLeft).fromNow(true) + "</strong>"  +
      "<br/>Weeks of life left: <strong>" + Math.floor(timeLeft.asWeeks()) + "</strong>" +
      "<br/>Days of life left: <strong>" + Math.floor(timeLeft.asDays()) + "</strong>" +
      "<br/>Time & Date of Death: <strong>" + moment().add(timeLeft).format('MM/DD/YYYY hh:mm a') + "</strong>" +
      "<br/>Percent of life lived: <strong>" + percentLived + "%</strong>" +
      "<br/>Presumed total length of life: <strong>" + birthdate.from(moment().add(timeLeft),true) + "</strong>" 
    );
    $('.results').fadeTo(1000,1);
  }

  function drawGrid(){
    console.log("drawGrid")
    var loc = {x:0,y:15};
    var rowCount = life.length/multiplier/yearsPerRow;
    if (rowCount < 1) rowCount = 1;

    $('.svgContainer').css({"opacity": "1"})
    var box = d3.select(".svgContainer")
      .append("svg")
      .attr("id","theCanvas")
      .attr("width",$('.svgContainer').width())
      .attr("height", 
        ((squareSize + spacing) * (rowCount) + 20)
      ) 
      // .style("border", "1px solid black");

    var rects = box
      .selectAll("rect")
      .data(life)
      .enter()
      .append("rect")
      .attr("x", function(unit,i){
        // note that this line means that instead of squareSize + spacing,
        // it is just spacing--so, for years, it's left of one square to
        // left of next square is 50px away, not 50+35. This should be 
        // changed. 
        loc.x = (i%rowSize === 0 ? start : loc.x + spacing + squareSize);
        return loc.x;
      })
      .attr("y", function(unit,i){
        if (i % rowSize === 0 && i !== 0) loc.y += spacing + squareSize;
        return loc.y;
      })
      .attr("width", squareSize)
      .attr("height", squareSize)
      .style("fill-opacity","0")
      .transition()
      .delay(function(d, i) {
        return i * delay ;
      })
      .duration(duration)
      .style("fill-opacity","1")
      .style("fill",function(d){
        return (d >= Math.floor(currentAge.as(scale)) ? "orange" : "grey");
      });
  }

    // trying to overlay text on unit... grrr
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
