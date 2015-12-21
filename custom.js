(function(){
  
  var life = [];
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

  window.drawLife = function(){
    var formattingError = isFormattingError();
    if (formattingError !== false) {
      if (alreadyDrawn) {
        $('.svgContainer').fadeTo(500,0,function(){
          $('.svgContainer').html();
        });
      } else {
        alreadyDrawn = true;
      }

      $('.results').fadeTo(500, 0, function(){
        $('.results').html(
          formattingError
          );
        $('.results').fadeTo(500, 1); 
      }); 
    
    } else {
      scale = $('input.timeScale:checked').val(); //from the radio buttons
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


      optimism      = $('#optimism')[0].value;
      birthdate     = moment($('#birthday').val(), "MM/DD/YYYY hh:mm A");
      currentAge    = moment.duration(moment().diff(birthdate));
      if (currentAge.asYears() < 0 ) currentAge = moment.duration({'days' : 0});

      timeLeft      = moment.duration((120*multiplier-Number(currentAge.as(scale)))*(optimism/100), scale) 
      ageAtDeath    = moment.duration(Number(currentAge.as(scale)) + Number(timeLeft.as(scale)), scale);
      percentLived  = Math.floor((100/(ageAtDeath.as('days')/currentAge.as('days')))*100)/100; // (*100, floor, /100) gives two extra decimal points as fraction
      // Handles exception for 0 optimism for dates in the future (i.e., 0*0 -> NaN)
      if (isNaN(percentLived)) percentLived = 0; 

      // Handles historical dates
      if (currentAge.asYears() > 119) { 
        timeLeft     = moment.duration({days:0});
        ageAtDeath   = currentAge;
        percentLived = 100;
      };

      if (ageAtDeath.as(scale) < 50000 || 
          prompt("50k range size limit reached. Your attempted unit size: " + 
            Math.floor(ageAtDeath.as(scale)) + 
            ". if you want to try this anyways--it may crash your browser!--type 'yes'") === 'yes') {
        
        life = [];
        for (var i = 1; i <= ageAtDeath.as(scale); i++){
          life.push(i);
        }
      } 


      if (alreadyDrawn) {
        $('.results').fadeTo(1000,0);
        $('.svgContainer').animate({"opacity": "0"}, 1000, function(){
          $('.svgContainer').html("");
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

  function isFormattingError() {
    var formatErrorMessage = "Birthday not formatted correctly. Please use this style of formatting: 12/30/1989.";
    var birthdate = $('#birthday').val().split("");
    console.log("birthdate:", birthdate);
    if (birthdate.length < 1) {
      return "Please enter a birthdate."
    }
    else if (birthdate.length < 5) {
      return formatErrorMessage;
    }

    var slashCount = 0;
    var numCount   = 0;
    for (var i = 0; i < birthdate.length; i++) {
      if (birthdate[i] === "/") {
        if (numCount < 1) {
          return formatErrorMessage;
        }
        slashCount++;
        if (isNaN(Number(birthdate[i+1])) || isNaN(Number(birthdate[i-1]))) {
          console.log(1)
          return formatErrorMessage;
        }
      }
      else if (!isNaN(Number(birthdate[i]))) {
        numCount++;
      }
      else {
        console.log(3)
        return formatErrorMessage;
      }
    }

    if (slashCount < 2 || numCount < 3) {
      console.log(4)
      return formatErrorMessage;
    }
    
    return false;
  }
 
  function drawStats() {
    currentAgeClone = moment.duration(currentAge.asYears(), "years");
    $('.results').html(
      "<table class='table'>" +
        "<tr>" +
          "<td>" + "Current Age:" + "</td>" +
          "<td>" + "<strong>" + Math.floor(currentAge.asYears()) + " years old</strong>" + "</td>" +
        "</tr>" +
        "<tr>" +
          "<td>" + "Time left:" + "</td>" +
          "<td>" + "<strong>" + moment().add(timeLeft).fromNow(true) + "</strong>" + "</td>" +
        "</tr>" +
        "<tr>" +
          "<td>" + "Weeks of Life left" + "</td>" +
          "<td>" + "<strong>" + Math.floor(timeLeft.asWeeks()) + "</strong>"  + "</td>" +
        "</tr>" +
        "<tr>" +
          "<td>" + "Days of Life left:" + "</td>" +
          "<td>" + "<strong>" + Math.floor(timeLeft.asDays()) + "</strong>" + "</td>" +
        "</tr>" +
        "<tr>" +
          "<td>" + "Time & Date of Death:" + "</td>" +
          "<td>" + "<strong>" + moment().add(timeLeft).format('MM/DD/YYYY hh:mm a') + "<strong>" + "</td>" +
        "</tr>" +
        "<tr>" +
          "<td>" + "Percent of Life lived:" + "</td>" +
          "<td>" + "<strong>" + percentLived + "%</strong>"  + "</td>" +
        "</tr>" +
        "<tr>" +
          "<td>" + "Length of life:" + "</td>" +
          "<td>" + "<strong>" + Math.floor(currentAgeClone.add(timeLeft).as('years')) + " years</strong>" + "</td>" +
        "</tr>" +            
      "</table>" +
      "<strong> Grey squares represent units of life already lived, gold represents units remaining. </strong>" +
      "<br /> <br />" + comment       
    )
    $('.results').fadeTo(1000,1);
  }

  function drawGrid(){
    var loc = {x:0, y:15};
    var rowCount = Math.ceil(life.length/multiplier/yearsPerRow);

    $('.svgContainer').css({"opacity": "1"})

    var box = d3.select(".svgContainer")
      .append("svg")
      .attr("id","theCanvas")
      .attr("width",$('.svgContainer').width())
      .attr("height", 
        ((squareSize + spacing) * rowCount) + 20
      ) 
      // .style("border", "1px solid black");

    var rects = box
      .selectAll("rect")
      .data(life)
      .enter()
      .append("rect")
      .attr("x", function(unit,i){
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
        return (d > Math.floor(currentAge.as(scale)) ? "orange" : "grey");
      });

    $('rect').on('click', function(){ 
      $(this).css('fill', 'rgb(128, 200, 128)'); 
    });
  }

}())
