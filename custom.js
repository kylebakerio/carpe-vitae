window.life = {years:[]};
var optimism = 100;
var now = moment();
var currentAge;
var percentLived;

var buttonActions = {
  years: life.years/*,
  months: life.years.months,
  weeks: life.years.months.weeks,
  days: life.years.months.weeks.days*/
};

function drawLife(){
  scale = $( 'input.timeScale:checked' ).val(); //from the radio buttons
  optimism = $('#optimism')[0].value;
  newBirthday = moment($('#birthday').val().split(" ")[0], "MM-DD-YYYY"); //should start using this
  birthday.year = parseInt(newBirthday.format('YYYY')); //using this for mvp
  currentAge = (now.format("YYYY") - birthday.year);
  console.log(currentAge);
  ageAtDeath = 120 * optimism/100;
  timeLeft = ( Math.floor(ageAtDeath - currentAge < 0 ? 0 : ageAtDeath - currentAge) );
  console.log(timeLeft + " is timeLeft");
  console.log("time left: " + timeLeft);
  percentLived = Math.floor( (100/( (timeLeft + currentAge) / currentAge) ) * 100 ) /100;
  percentLived = percentLived > 100 ? 100 : percentLived;

  console.log(birthday.year + currentAge + timeLeft);
  window.life = {years:[]};
  for (var i = birthday.year; i < (birthday.year + currentAge + timeLeft); i++){
    if (i > birthday.year + 120) break;
    window.life.years.push([i,1,2,3,4,5,6,7,8,9,10,11,12]);
  }

  console.log(scale);

  //these are coordinates for the squares
  var spot = [0,15];

  //this wipes the slate clean before every animation
  $('.svgContainer').html("");

  var box = d3.select(".svgContainer")
   .append("svg")
   .attr("id","theCanvas")
   .attr("width",800)
   .attr("height",700); //eventually, make this responsive, so you only get scroll bar if truly necessary... 
   // .style("border", "1px solid black");

  var circs = box
    .selectAll("rect")
    .data(life.years)
    .enter()
    .append("rect")
    .attr("x", function(year,i){
      spot[0] = (i%10 === 0 ? 168 : spot[0] + 50);
      return spot[0];
    })
    .attr("y", function(year,i){
      if (i % 10 === 0 && i !== 0) spot[1]+=50;
      return spot[1];
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

  // var overlay = circs.append("text").text(function (d) {
  //     return d[0]-birthday.year;
  //   })
  //   .attr("x",function (d) {
  //     return //x;
  //   })
  //   .attr("y",function (d) {
  //     return //y;
  //   })
  //   .attr('text-anchor', 'middle')
  //   .style("fill", "white").style("stroke-width", 1.5);

  $('rect').on('click', function(){ $(this).css('fill', 'rgb(128, 200, 128)'); });
  $('.results').html(
    "Current Age: <strong>" + currentAge + "</strong><br/>" +
    "Years left of life: <strong>" + timeLeft +
    "</strong><br/>Presumed total length of life: <strong>" + (currentAge + timeLeft) +
    " years</strong><br/>Percent of life lived: <strong>" + percentLived +
    "%</strong>" + "<br/> Year of Death: <strong>" + (Math.ceil(parseInt(now.format("YYYY")) + timeLeft)) + "</strong>"
  );
}
